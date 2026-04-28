import Footer from "../models/footerModel.js";


export const getFooter = async (req, res) => {
  try {
    const data = await Footer.findOne();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateFooter = async (req, res) => {
  try {
    const { copyright } = req.body;

    let footer = await Footer.findOne();
    if (!footer) {
      footer = await Footer.create({ copyright });
    } else {
      footer.copyright = copyright;
      await footer.save();
    }

    res.status(200).json(footer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

