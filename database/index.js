const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const sharp = require('sharp');
const cron = require('node-cron');
const https = require('https');
const webpush = require("web-push");



const app = express();
const PORT = process.env.PORT || 5000;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = {
  origin: 'https://recipeeze.vercel.app', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors());
app.use('/uploads/', express.static('uploads'));

const backendUrl = 'https://recipe-backend-1e02.onrender.com/api/posts?page=1&limi=5';

// Schedule a cron job to ping the backend URL every 14 minutes
cron.schedule('*/14 * * * *', () => {
  https.get(backendUrl, (res) => {
    if (res.statusCode === 200) {
      console.log('Server is running.');
    } else {
      console.log('Server may be sleeping.');
    }
  }).on('error', (error) => {
    console.error('Error pinging the server:', error);
  });
});

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
    type:Buffer, 
    default:'../frontend/recipe/src/components/defaultimg.jpg'
  },
  bio: String,
});
// Mongoose schema for comments
const replySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: String,
  text: String,
});

const Reply = mongoose.model('Reply', replySchema);

// Comment schema
const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: String,
  text: String,
  replies: [replySchema], // Array of replies
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  comments: [commentSchema]
});
const User = mongoose.model('User', userSchema);
const Recipe = mongoose.model('Recipe', recipeSchema);

app.post('/api/comment/:postId', async (req, res) => {
  const { userId, text, parentCommentId } = req.body; // Include parentCommentId in the request body

  try {
    const post = await Recipe.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (parentCommentId) {
      // If parentCommentId is provided, it means this is a reply
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ error: 'Parent comment not found' });
      }

      const newReply = new Comment({
        user: userId,
        name: user.name,
        text,
      });

      parentComment.replies.push(newReply);
      await parentComment.save();
      res.status(201).json(newReply);
    } else {
      // If parentCommentId is not provided, it's a top-level comment
      const newComment = new Comment({
        user: userId,
        name: user.name,
        text,
      });

      post.comments.push(newComment);
      await post.save();
      res.status(201).json(newComment);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error adding comment' });
  }
});
app.get('/api/user/liked-posts/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const likedPosts = await Like.find({ userId }).select('postId').exec();
    res.json(likedPosts.map(like => like.postId));
  } catch (error) {
    console.error('Error fetching liked posts:', error);
    res.status(500).json({ message: 'Error fetching liked posts' });
  }
});
app.get('/api/post/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Recipe.findById(postId);
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'An error occurred while fetching the post' });
  }
});

app.put('/api/post/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, ingredients, steps, notes, cookingTime, category } = req.body;

    const updatedFields = {
      title,
      ingredients,
      steps,
      notes,
      cookingTime,
      category
    };

    const updatedPost = await Recipe.findByIdAndUpdate(postId, updatedFields, { new: true });

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'An error occurred while updating the post' });
  }
});

app.post('/api/comment/:postId/addReply/:commentId', async (req, res) => {
  const { userId, text, name } = req.body;
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  try {
    const post = await Recipe.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Find the parent comment in the post
    const parentComment = post.comments.id(commentId);
    if (!parentComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Create a new reply
    const newReply = new Reply({
      user: userId,
      name,
      text,
    });

    // Add the reply to the parent comment's replies array
    parentComment.replies.push(newReply);
    await post.save();

    res.status(201).json(newReply);
  } catch (error) {
    res.status(500).json({ error: 'Error adding reply' });
  }
});



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
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Send email
    const mailOptions = {
      from: 'Recipeeze User',
      to: 'codersaro@gmail.com', // Replace with your actual email to receive contact form submissions
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email: ', error);
        res.status(500).json({ success: false, error: error.message });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ success: true, message: 'Message sent successfully.' });
      }
    });
  } catch (error) {
    console.error('Error sending contact form email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
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
    const compressedImageBuffer = await sharp(imageBuffer)
      .resize({ width: 800 }) // Adjust the width as needed
      .webp({ quality: 70 }) // Adjust the quality as needed (for JPEG)
      .toBuffer();

    const binaryImageString = compressedImageBuffer.toString('hex');


    const newRecipe = await Recipe.create({
      ...req.body,
      userId: user._id, // Save user's ID
      authorName: user.name, // Save user's name
      image: compressedImageBuffer, // Save the compressed image as binary data
    });

    res.status(201).json(newRecipe);
    console.log(newRecipe);
  } catch (error) {
    res.status(500).json({ error: 'Error creating recipe' });
  }
});
// GET endpoint to get followers of a user
app.get('/api/user/:userId/followers', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the user by userId from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followers = user.followers;

    res.json({ followers });
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ error: 'Error fetching followers' });
  }
});
app.get('/api/followers/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID and populate the followers field to get follower details
    const user = await User.findById(userId).populate('followers', 'username email');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ followers: user.followers });
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ error: 'Error fetching followers' });
  }
});
app.post('/api/sendNotificationToFollowers', async (req, res) => {
  try {
    const { userId, message } = req.body;

    // Assuming you have a User model
    const user = await User.findById(userId);

    // Assuming you have a followers field in your User model
    const followers = user.followers;

    // Send notification to all followers
    followers.forEach(async followerId => {
      // Assuming you have a Notification model or collection
      await Notification.create({
        userId: followerId,
        message: message,
        timestamp: new Date(),
      });
    });

    res.status(200).json({ success: true, message: 'Notifications sent successfully' });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to send notifications' });
  }
});


const recipeImageCacheStrategy = (res) => {
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
};

app.get('/api/getRecipeImage/:recipeId', async (req, res) => {
  try {
    const recipeId = req.params.recipeId;

    // Fetch the recipe from MongoDB
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }
    recipeImageCacheStrategy(res);

    // Send the image as binary data
    res.contentType('image/webp'); // Set the content type to WebP
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
app.get('/api/userName/:userId', async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(req.params.userId)
  if (user) {
    res.json({ name: user.name }); // Sending only the name for simplicity
  } else {
    res.status(404).json({ error: 'User not found' });
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

    if (!user.profileImage) {
      // Set the content type of the default image (adjust as needed)
      res.contentType('image/webp');
      // Send the default image binary data
      res.sendFile('./default.jpg'); // Replace with the actual path to your default image
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

app.delete('/api/removeProfileImage/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set the profileImage field to null
    user.profileImage = null;

    // Save the updated user
    await user.save();

    res.json({ message: 'Profile picture removed' });
  } catch (error) {
    console.error('Error removing profile picture:', error);
    res.status(500).json({ message: 'Internal server error' });
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Fetch the latest 5 posts first, based on createdAt in descending order
    const posts = await Recipe.find()
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit);

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
// API endpoint to add a comment
app.post('/api/comment/:postId', async (req, res) => {
  const { userId, text, replyTo } = req.body;
  const postId = req.params.postId;

  try {
    const post = await Recipe.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newComment = new Comment({
      user: userId,
      name: user.name,
      text,
    });

    if (replyTo) {
      // If replyTo is provided, it's a reply
      const parentComment = await Comment.findById(replyTo);
      if (!parentComment) {
        return res.status(404).json({ error: 'Parent comment not found' });
      }

      // Add the reply to the parent comment's replies array
      parentComment.replies.push(newComment);
      await parentComment.save();
    } else {
      // If replyTo is not provided, it's a top-level comment
      post.comments.push(newComment);
      await post.save();
    }

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

    console.log('User ID:', req.body.userId);

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
    console.error(error);
    res.status(500).json({ error: 'Error deleting comment' });
  }
});

app.delete('/api/comment/:postId/:commentId/:replyId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const replyId = req.params.replyId;

    const post = await Recipe.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = post.comments.find(comment => comment._id.toString() === commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const replyIndex = comment.replies.findIndex(reply => reply._id.toString() === replyId);
    if (replyIndex === -1) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    // Delete the reply
    comment.replies.splice(replyIndex, 1);
    await post.save();

    res.status(200).json({ message: 'Reply deleted successfully' });
    console.log("Reply deleted succesfully")
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting reply' });
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
    cache.clear('/api/posts');
  } catch (error) {
    res.status(500).json({ error: 'Error deleting post' });
  }
});

//search
// Add this to your Express app.js or server.js
app.get('/api/search', async (req, res) => {
  const { q, category } = req.query;

  try {
    // Create a filter object to filter by title and category
    const filter = {
      title: { $regex: q, $options: 'i' },
    };

    // Add category filter if category is specified
    if (category) {
      filter.category = category;
    }

    const searchResults = await Recipe.find(filter).populate('userId', 'name');
    res.status(200).json(searchResults);
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ error: 'Error searching posts' });
  }
});

app.get('/api/searchUsers', async (req, res) => {
  const { q } = req.query;

  try {
    // Use a case-insensitive regular expression to search for users by name
    const searchResults = await User.find({ name: { $regex: q, $options: 'i' }});
    res.status(200).json(searchResults);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Error searching users' });
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
