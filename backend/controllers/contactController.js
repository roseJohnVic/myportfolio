import Contact from "../models/contactModel.js";
import nodemailer from "nodemailer";

export const saveUsers = async (req, res, next) => {
    try {
        const { name, phone, email, address, message } = req.body;
        if (!name || !phone || !email || !address || !message) {
            return res.status(401).json({ message: "All fields are required" });
        }

   const nameField = /^[A-Za-z\s]+$/;
    if (!nameField.test(name)) {
      return res.status(400).json({ message: "Name should contain only letters" });
    }

      const phoneField = /^\d{10}$/;
    if (!phoneField.test(phone)) {
      return res.status(400).json({ message: "Phone number must be 10 digits" });
    }

        const emailField = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailField.test(email)) {
      return res.status(400).json({ message: "Email must be a valid @gmail.com address" });
    }



        const newUser = await Contact.create({ name, email, message, address,phone });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL, 
        pass: process.env.GG_PASSWORD, 
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.ADMIN_EMAIL, 
      subject: `New Contact Form Submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Address: ${address}
        Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const contacts = await Contact.find();
        res.status(201).json(contacts);
    } catch (error) {
        next(error);
    }
}


export const deleteAllUsers = async (req, res, next) => {
    try {
        await Contact.deleteMany({})
        res.status(200).json({ message: "All messages deleted successfully" });
    } catch (error) {
        next(error)
    }
}


export const deleteUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User deleted successfully" });
    }catch (error) {
  console.log("Contact Save Error:", error);
  res.status(500).json({
    message: error.message,
    error: error
  });
}
}