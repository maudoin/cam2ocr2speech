# 📘 Application pour la lecture et la manipulation de documents accessibles

## 📄 Présentation

Cette application est conçue pour aider les personnes atteintes de troubles "dys" (dyslexie, dyspraxie, etc.) à travailler sur des documents papier à l'aide d'un ordinateur. Elle permet :

- 🔊 De lire à voix haute le texte sélectionné dans un PDF.
- 📝 D'ajouter du texte et d'imprimmer sur un PDF.
- 🖼️ De générer un PDF à partir d'une image, avec une couche de texte sélectionnable (reconaissance de charactères).
- ✂️ De détecter automatiquement le contour d'une feuille sur une image pour redresser le texte.
- ✏️ De modifier manuellement le contour détecté pour améliorer la précision.
- 📷 De capturer une image depuis une webcam ou d'importer une image depuis un fichier.

---

# 📘 Document Reader & Editor App

## 📄 Overview

This application supports individuals with "dys" disorders (e.g., dyslexia, dyspraxia) in working with physical text documents using a computer. It provides the following features:

- 🔊 Reads aloud selected text from PDFs using Text-to-Speech (TTS).
- 📝 Adding Text and Printing PDF
- 🖼️ Generates a PDF from an image with selectable text layer via character recognition (OCR).
- ✂️ Automatically detects document boundaries in images for perspective correction.
- ✏️ Allows manual editing of detected contours.
- 📷 Captures images using a webcam or loads images from files.

---

## ⚙️ Technologies Used

- 🧠 The application is developed in **JavaScript** and uses **Electron** to deliver a native desktop experience.
- 🔍 **Tesseract v6.0.1** for Optical Character Recognition (OCR)
  [GitHub - Tesseract OCR](https://github.com/tesseract-ocr/tesseract)
- 🗣️ **piper-tts-web** for Text-to-Speech (TTS)
  [GitHub - Piper TTS Web](https://github.com/Mintplex-Labs/piper-tts-web)
- 📄 **pdf.js v5.3.93** by Mozilla for PDF rendering and editing
  [GitHub - Mozilla PDF.js](https://github.com/mozilla/pdf.js)
- 🖼️ **OpenCV.js v4.0** for image processing and contour detection
  [GitHub - opencv-js](https://github.com/TechStark/opencv-js)