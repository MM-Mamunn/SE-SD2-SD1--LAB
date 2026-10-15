const profileFunction = async (req, res) => {
  try {
    const message = "Name: XYZ, ID: 12345, Course: ABC";

    return res.status(200).json({ message });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

export { profileFunction };