
# PDF-Query

PDF-query is a simple web application that allows users to upload PDF documents and query the content of those documents. The application processes the uploaded PDFs and utilizes natural language processing to provide answers to questions posed by the users.

![Screenshot 2024-10-26 053043](https://github.com/user-attachments/assets/53bf89cb-5d1d-4476-b3be-d13ea83cc2a1)
![Screenshot 2024-10-26 053343](https://github.com/user-attachments/assets/4cb858a4-0352-4a9a-bcaa-b7b043e2feb0)
![Screenshot 2024-10-26 053437](https://github.com/user-attachments/assets/485207e9-dc89-4dda-9f2b-ca47d56ca1ec)


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
