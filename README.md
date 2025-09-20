
# B2B Cheque Manager

## Description

The B2B Cheque Manager is a React-based application designed to streamline and modernize the process of managing business-to-business cheques. It provides a user-friendly interface for adding, viewing, searching, and managing cheque information, enhanced by AI-powered assistance using the Google Gemini API.

## Features

*   **Cheque Table:** A searchable and sortable table displaying all cheque information, including payee, amount, date, and status.
*   **Add Cheque Modal:** An intuitive modal form for adding new cheque entries.
*   **Image Preview Modal:** Allows users to view cheque images associated with each entry.
*   **AI Assistant:** Leverages the Google Gemini API to provide intelligent assistance with cheque processing, such as data extraction and validation.

## Technologies Used

*   React
*   TypeScript
*   Vite
*   Google Gemini API

## Prerequisites

Before running the application, ensure you have the following installed:

*   Node.js (v18 or higher)
*   npm or yarn

## Installation

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    ```

2.  Navigate to the project directory:

    ```bash
    cd b2b-cheque-manager
    ```

3.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

## Configuration

1.  Create a `.env.local` file in the project root directory.

2.  Add your Google Gemini API key to the `.env.local` file:

    ```
    GEMINI_API_KEY=<your_gemini_api_key>
    ```

    **Note:** Obtain your Gemini API key from the Google AI Studio.

## Running the Application

1.  Start the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

2.  Open your browser and navigate to `http://localhost:5173`.

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.

2.  Create a new branch for your feature or bug fix.

3.  Commit your changes with descriptive commit messages.

4.  Push your changes to your fork.

5.  Submit a pull request.

## License

[MIT](LICENSE)
