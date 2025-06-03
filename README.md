
# Sales Incentive Platform

A comprehensive web application for managing sales incentives with separate portals for administrators and users.

## Features

### Admin Portal
- Upload PDF scheme documents
- Upload Excel/CSV sales data with automatic parsing
- Download data template
- View uploaded data in tabular format
- Regional analytics and summaries
- Publish data to make it available to users

### User Portal
- Select region and store
- View sales targets and achievements
- Check qualification status
- View earned incentives
- Detailed performance breakdown

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Icons**: Lucide React
- **State Management**: Custom data store
- **File Processing**: Custom Excel/CSV parser

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sales-incentive-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:8080 in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Deployment

The application can be deployed to any static hosting service:

- **Netlify**: Connect your repository and deploy automatically
- **Vercel**: Connect your repository for automatic deployments
- **GitHub Pages**: Use GitHub Actions to deploy the built files
- **AWS S3**: Upload the built files to an S3 bucket with static website hosting

## Data Format

### Excel/CSV Template

The sales data file should have the following columns:
- Store Name
- City
- Region
- Total Target (numeric)
- Total Achievement (numeric)
- Qualified/Not Qualified (text)
- Total Incentive Earned (numeric)

Download the template from the admin portal to get the correct format.

## Usage

1. **Admin Setup**:
   - Access the Admin Portal
   - Upload the PDF scheme document
   - Download and fill the sales data template
   - Upload the completed Excel/CSV file
   - Review the data in the View Data tab
   - Check regional analytics
   - Publish the data to make it available to users

2. **User Access**:
   - Access the User Portal
   - Select your region and store
   - View your performance metrics
   - Check qualification status and earned incentives

## Environment Variables

No environment variables are required for basic functionality. The application runs entirely in the browser.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
