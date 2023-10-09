const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads/', express.static('uploads'));

// Connect to MongoDB
mongoose.connect('mongodb+srv://codersaro:Sarorosy12@cluster0.av48khu.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

  // Configure multer for image uploads
const storage = multer.memoryStorage();

const upload = multer({storage});

const notificationSchema = new mongoose.Schema({
  type: String,
  postId: mongoose.Schema.Types.ObjectId,
  message: String,
  isRead: Boolean,
  createdAt: Date,
  UserId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});
// Mongoose schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe', // Reference to the Recipe model
    },
  ],
  notifications: [notificationSchema],
  followerCount: {
    type: Number,
    default: 0,
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  profileImage: {
    type:Buffer, // Store the content type of the image (e.g., 'image/jpeg', 'image/png', etc.)
  },
  bio: String,
});
// Mongoose schema for comments
const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name:String,
  text: String,
  
});

const Comment = mongoose.model('Comment', commentSchema);

const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: String,
  steps: String,
  tags: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  image: {
    type: Buffer, // Store binary data
  },
  authorName: String,
  cookingTime: Number,
  notesAndTips: String,
  category: String,
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  
  comments: [commentSchema]
});

const User = mongoose.model('User', userSchema);
const Recipe = mongoose.model('Recipe', recipeSchema);

app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch notifications and mark them as read
    const notifications = user.notifications;
    user.notifications = notifications.map(notification => {
      if (!notification.isRead) {
        notification.isRead = true;
      }
      return notification;
    });
    await user.save();

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching notifications' });
  }
});


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL/TLS
  auth: {
    user: 'recipeeze.contact@gmail.com',
    pass: 'fnjl wmoq licf ogtb', // Use an App Password or your account password
  },
});
const PasswordReset = mongoose.model('PasswordReset', {
  email: String,
  token: String,
  expires: Date,
});
// POST route for sending reset password email
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Access the user's password field
    const password = user.password;


    // Compose the email
     const mailOptions = {
  from: 'Saro from recipeeze',
  to: email,
  subject: 'Password Reset Request',
  html: `
    <html>
      <head>
        <style>
          /* Add your custom styles here */
          body {
            background-color: #f2f2f2;
            font-family: Arial, sans-serif;
          }
          .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          }
          h1 {
            color: #3498db;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Recipeeze Password Reset</h1>
          <p>Here's your password:</p>
          <p><strong>${password}</strong></p>
        </div>
      </body>
    </html>
  `,
};



    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email: ', error);
        res.status(500).json({ error: 'Failed to send reset email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.json({ message: 'Password sent to your email successfully' });
      }
    });
  } catch (error) {
    console.error('Error processing password reset request:', error);
    res.status(500).json({ error: 'Error processing password reset request' });
  }
});

app.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Retrieve the user based on the token
    const user = await User.findOne({ resetPasswordToken: token });

    // Check if the user exists and the token is valid
    if (!user || !user.resetPasswordToken || user.resetPasswordToken !== token) {
      return res.status(400).json({ message: 'Invalid token. Please request a new password reset link.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while resetting the password.' });
  }
});
// API endpoint for user signup
// API endpoint for user signup
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if the email or phone number is already registered
    const existingUserEmail = await User.findOne({ email });
    const existingUserPhone = await User.findOne({ phone });

    if (existingUserEmail) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    if (existingUserPhone) {
      return res.status(409).json({ error: 'Phone number is already registered' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      password
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the stored password (plain text)
    if (password === user.password) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        // ... other user data you want to send to the client
      });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});
// API endpoint for posting a recipe
app.post('/api/postRecipe', upload.single('image'), async (req, res) => {
  try {
    const userId = req.body.userId;

    // Fetch user's name using userId
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return console.log('user not found');
    }

    const imageBuffer = req.file.buffer;
    const binaryImageString = imageBuffer.toString('hex');

    console.log(binaryImageString);

    const newRecipe = await Recipe.create({
      ...req.body,
      userId: user._id, // Save user's ID
      authorName: user.name, // Save user's name
      image: imageBuffer, // Save the image as binary data
    });

    res.status(201).json(newRecipe);
    console.log(newRecipe);
  } catch (error) {
    res.status(500).json({ error: 'Error creating recipe' });
  }
});
app.get('/api/getRecipeImage/:recipeId', async (req, res) => {
  try {
    const recipeId = req.params.recipeId;

    // Fetch the recipe from MongoDB
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    // Send the image as binary data
    res.contentType('image/jpeg'); // Adjust the content type as needed
    res.send(recipe.image);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching image' });
  }
});

// API endpoint to get user data by ID
app.get('/api/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    .populate('followers', 'name') // Populate followers with only name field
      .populate('following', 'name');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

// API endpoint to get recipe count for a specific user
app.get('/api/recipe/count/:userId', async (req, res) => {
  try {
    const count = await Recipe.countDocuments({ userId: req.params.userId });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching recipe count' });
  }
});

app.get('/api/searchUsers', async (req, res) => {
  try {
    const searchQuery = req.query.q; // Get the search query from the request query parameters
    // Perform a database query to search for users based on the search query
    // Replace the following line with your actual database query
    const users = await User.find({ name: { $regex: searchQuery, $options: 'i' } });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching user search results:', error);
    res.status(500).json({ error: 'Error fetching user search results' });
  }
});

app.post('/api/uploadProfileImage/:userId', upload.single('image'), async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch user from MongoDB
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Save the uploaded image data to the user's profileImage field
    user.profileImage = req.file.buffer;
    await user.save();

    res.status(201).json({ profileImage: `data:image/jpeg;base64,${user.profileImage.toString('base64')}` });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading profile image' });
  }
});

app.get('/api/getProfileImage/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch the user from MongoDB by user ID
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Ensure the user has a profile image
    if (!user.profileImage) {
      res.status(404).json({ error: 'Profile image not found' });
      return;
    }

    // Send the profile image as binary data
    res.contentType('image/jpeg'); // Adjust the content type as needed
    res.send(user.profileImage);
  } catch (error) {
    console.error('Error fetching profile image:', error);
    res.status(500).json({ error: 'Error fetching profile image' });
  }
});

// API endpoint to update user data by ID
app.patch('/api/user/:userId', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { 
        name: req.body.name,
        bio: req.body.bio  // Include the bio field as well
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user data' });
  }
});

app.get('/author/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (user) {
      res.json({ name: user.name });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching author name' });
  }
});



app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Recipe.find().populate('userId', 'name');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
});

app.post('/api/like/:postId', async (req, res) => {
  const { userId } = req.body;
  const postId = req.params.postId;

  try {
    const post = await Recipe.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const liked = post.likes.includes(userId);

    if (liked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    // Update the isLiked field in the response data
    const updatedPost = await post.save();
    const responsePost = {
      ...updatedPost._doc,
      isLiked: updatedPost.likes.includes(userId),
    };

    res.status(200).json(responsePost);
  } catch (error) {
    res.status(500).json({ error: 'Error toggling like' });
  }
});

app.get('/api/user-posts/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Recipe.find({ userId }); // Find posts with matching userId
    res.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add this API endpoint to create notifications
app.post('/api/notifications', async (req, res) => {
  const { userId, postId, type, message } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const notification = {
      type,
      postId,
      message,
      isRead: false,
    };

    user.notifications.push(notification);
    await user.save();

    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Error creating notification' });
  }
});



app.get('/api/liked-posts/:userId', async (req, res) => {
  try {
    const likedPosts = await Recipe.find({ likes: req.params.userId });
    res.status(200).json(likedPosts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching liked posts' });
  }
});

// API endpoint to add a comment
app.post('/api/comment/:postId', async (req, res) => {
  const { userId, text, } = req.body;

  try {
    const post = await Recipe.findById(req.params.postId);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const newComment = new Comment({
      user: userId,
      name:user.name,
      text,
    });

    post.comments.push(newComment);
    await post.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Error adding comment' });
  }
});

// API endpoint to delete a comment
app.delete('/api/comment/:postId/:commentId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const post = await Recipe.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = post.comments.find(comment => comment._id.toString() === commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if the logged-in user is the owner of the comment
    if (comment.user.toString() !== req.body.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    post.comments.pull(commentId);
    await post.save();
    
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting comment' });
  }
});
app.get('/api/comments/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.find({ postId });
    console.log('Fetched comments:', comments);
    res.json(comments);
    
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'An error occurred while fetching comments.' });
  }
});
///add comment full
// API endpoint to add a comment to a specific post
app.post('/api/comment/:postId', async (req, res) => {
  const { userId, text } = req.body;

  try {
    const post = await Recipe.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const newComment = new Comment({
      user: userId,
      text,
    });

    post.comments.push(newComment);
    await post.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Error adding comment' });
  }
});


app.get('/api/posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Recipe.findById(postId).populate('userId', 'name');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching post details' });
  }
});
// API endpoint to get posts made by the current user
app.get('/api/myposts/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await Recipe.find({ userId }).populate('userId', 'name');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching my posts' });
  }
});
app.delete('/api/post/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;

    const deletedPost = await Recipe.findOneAndDelete({ _id: postId });
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting post' });
  }
});

//search
// Add this to your Express app.js or server.js
app.get('/api/search', async (req, res) => {
  const { q } = req.query;

  try {
    const searchResults = await Recipe.find({ title: { $regex: q, $options: 'i' } }).populate('userId', 'name');
    res.status(200).json(searchResults);
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ error: 'Error searching posts' });
  }
});

//favourite
// Add these API endpoints to your server code
app.get('/api/isFavorite/:userId/:postId', async (req, res) => {
  const { userId, postId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isFavorite = user.favorites.includes(postId);
    res.status(200).json({ isFavorite });
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.status(500).json({ error: 'Error checking favorite' });
  }
});

app.post('/api/addFavorite/:userId/:postId', async (req, res) => {
  const { userId, postId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.favorites.includes(postId)) {
      user.favorites.push(postId);
      await user.save();
    }

    res.status(200).json({ message: 'Added to favorites' });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ error: 'Error adding to favorites' });
  }
});


app.get('/api/post-by-title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const post = await Recipe.findOne({ title }).populate('userId', 'name');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post details:', error);
    res.status(500).json({ error: 'Error fetching post details' });
  }
});

app.get('/api/favorite-posts/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('favorites'); // Populate the 'favorites' field
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const favoritePosts = user.favorites;
    res.status(200).json(favoritePosts);
  } catch (error) {
    console.error('Error fetching favorite posts:', error);
    res.status(500).json({ error: 'Error fetching favorite posts' });
  }
});
app.delete('/api/removeFavorite/:userId/:postId', async (req, res) => {
  const { userId, postId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const postIndex = user.favorites.indexOf(postId);
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found in favorites' });
    }

    user.favorites.splice(postIndex, 1);
    await user.save();
    
    res.status(200).json({ message: 'Post removed from favorites successfully' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Error removing from favorites' });
  }
});


// Add or remove a post from user's favorites
app.post('/api/update-favorites/:userId/:postId', async (req, res) => {
  const { userId, postId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const postIndex = user.favorites.indexOf(postId);
    if (postIndex === -1) {
      user.favorites.push(postId);
    } else {
      user.favorites.splice(postIndex, 1);
    }

    await user.save();
    res.status(200).json({ message: 'Favorites updated successfully' });
  } catch (error) {
    console.error('Error updating favorites:', error);
    res.status(500).json({ error: 'Error updating favorites' });
  }
});
app.get('/api/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const recipeCount = await Recipe.countDocuments({ userId: user._id });

    // Return the user profile data
    res.status(200).json({ name: user.name, recipeCount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// Follow a user
app.post('/api/user/:userId/follow', async (req, res) => {
  try {
    const followerId = req.body.followerId;
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.followers.includes(followerId)) {
      user.followers.push(followerId);
      await user.save();
    }

    res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: 'An error occurred while following the user' });
  }
});

// Unfollow a user
app.delete('/api/user/:userId/unfollow', async (req, res) => {
  try {
    const followerId = req.body.followerId;
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followerIndex = user.followers.indexOf(followerId);
    if (followerIndex !== -1) {
      user.followers.splice(followerIndex, 1);
      await user.save();
    }

    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ error: 'An error occurred while unfollowing the user' });
  }
});
//followers
app.get('/api/user/:userId/followers', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('followers', 'name'); // Populate followers with only their names
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ followers: user.followers });
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ error: 'An error occurred while fetching followers' });
  }
});
app.get('/api/user/:userId/is-following/:followerId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isFollowing = user.followers.includes(req.params.followerId);
    res.status(200).json({ isFollowing });
  } catch (error) {
    console.error('Error checking follow status:', error);
    res.status(500).json({ error: 'An error occurred while checking follow status' });
  }
});
app.get('/api/user/:userId/follower-count', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    res.json({ count: user.followers.length });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching follower count' });
  }
});

// Route to get following count for a user
app.get('/api/user/:userId/following-count', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    res.json({ count: user.following.length });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching following count' });
  }
});

app.get('/api/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId); // Assuming you have a User model
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user data as JSON
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// API endpoint to add a notification
// API endpoint to add a notification
app.post('/api/addNotification/:userId', async (req, res) => {
  const { userId } = req.params;
  const { notification } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add the notification to the user's notifications array
    user.notifications.push(notification);

    // Check if this is a "like" notification
    if (notification.type === 'like') {
      // Extract the post owner's ID from the notification
      const postOwnerId = notification.postOwnerId;

      // Find the post owner
      const postOwner = await User.findById(postOwnerId);

      if (postOwner) {
        // Append the notification to the post owner's notifications array
        postOwner.notifications.push(notification);
        await postOwner.save();
      }
    }

    await user.save();

    res.status(201).json({ message: 'Notification added successfully' });
  } catch (error) {
    console.error('Error adding notification:', error);
    res.status(500).json({ error: 'Error adding notification' });
  }
});
app.delete('/api/notifications/:userId/:index', async (req, res) => {
  const { userId, index } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the index is within the bounds of the notifications array
    if (index < 0 || index >= user.notifications.length) {
      return res.status(404).json({ error: 'Invalid notification index' });
    }

    // Remove the notification at the specified index
    user.notifications.splice(index, 1);
    await user.save();

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Error deleting notification' });
  }
});


// API endpoint to get notifications for a user by ID
app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user's notifications
    const notifications = user.notifications;
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
});


// Add this API endpoint to your Express app.js or server.js
app.get('/api/liked-post-author/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the liked post by its ID
    const likedPost = await Recipe.findById(postId);

    if (!likedPost) {
      return res.status(404).json({ error: 'Liked post not found' });
    }

    // Return the author's ID of the liked post
    res.status(200).json({ authorId: likedPost.userId });
  } catch (error) {
    console.error('Error fetching liked post author ID:', error);
    res.status(500).json({ error: 'Error fetching liked post author ID' });
  }
});





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
