
# PDF-Query

PDF-query is a simple web application that allows users to upload PDF documents and query the content of those documents. The application processes the uploaded PDFs and utilizes natural language processing to provide answers to questions posed by the users.

![Screenshot 2024-10-26 053043](https://github.com/user-attachments/assets/4b701f55-ef3f-412a-8861-9a8c37c58323)
![Screenshot 2024-10-26 053343](https://github.com/user-attachments/assets/b54c2a54-4f83-47f0-9fc5-075f232c2399)
![Screenshot 2024-10-26 053437](https://github.com/user-attachments/assets/359dd71b-8154-4746-85a8-e9c39c690a72)


## Installation

To install the required dependencies, run the following command:

```bash
npm install

```

## Usage

To run the application, execute:

```bash
node server.js
```



### API Endpoints

- **Root Endpoint**: Check if the server is up and running.
  - Method: GET
  - Endpoint: `/`
  - Description: endpoint to check if the server is up and running

- **Upload Endpoint**: Upload a PDF file.
  - Method: POST
  - Endpoint: `/upload`
  - Description: endpoint to upload a PDF file
  - Request Body: Form-data with the file
  - Response: JSON with a success message if the file is uploaded successfully



- **Talk Endpoint**: Ask questions regarding the PDF.
  - Method: POST
  - Endpoint: `/talk`
  - Description: endpoint to ask questions regarding the PDF
  - Request Body: JSON with a question
  - Response: JSON with the response message and ID


## Acknowledgments
- Express for the backend framework.
- React for the frontend framework.
- Multer for handling file uploads.
- pdf-parse for extracting text from PDF files.
- Natural for natural language processing capabilities.
