const logout = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,          // Must match login's 'secure: true'
      sameSite: 'None',      // Must match login's 'sameSite: None'
      path: '/',             // Must match login's path
      // domain: '.yourdomain.com' // Uncomment if using cross-subdomains
    });

    res.status(200).json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during logout'
    });
  }
};

module.exports = { logout };