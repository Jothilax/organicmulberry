import Contact from "./contact.model.js";

export const createContact = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, subject, message } = req.body;

    if (!first_name || !last_name || !email || !message) {
      return res.status(400).json({
        message: "First name, last name, email, and message are required",
      });
    }

    const contact = await Contact.create({
      first_name,
      last_name,
      email,
      phone,
      subject: subject || "General Inquiry",
      message,
    });

    return res.status(201).json({
      message: "Contact form submitted successfully",
      contact: {
        id: contact.id,
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email,
      },
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    return res.status(500).json({
      message: "Failed to submit contact form",
      error: error.message,
    });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Contacts fetched successfully",
      total: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({
      message: "Failed to fetch contacts",
      error: error.message,
    });
  }
};

