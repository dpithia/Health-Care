# Healthcare Symptom Checker

A modern web application that helps users assess their symptoms and find appropriate medical care. Built with React, TypeScript, and Tailwind CSS, utilizing the NIH Clinical Tables API for medical data.

## Features

### 🔍 Symptom Assessment
- Real-time symptom search using NIH medical database
- Smart symptom suggestions and auto-complete
- Multi-symptom analysis

### 🏥 Diagnosis Support
- AI-powered symptom analysis
- Urgency level assessment
- Potential condition matching
- Medical terminology explanations

### 📍 Healthcare Provider Recommendations
- Severity-based care recommendations
- Facility type suggestions
- Location-based facility finder
- Emergency care guidance

### 💻 Technical Features
- Modern, responsive UI
- Real-time API integration
- Geolocation support
- Accessible design

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- Modern web browser

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/healthcare-symptom-checker.git
cd healthcare-symptom-checker
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Technologies Used

- **Frontend Framework**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Medical Data**: NIH Clinical Tables API
- **Icons**: Lucide React
- **State Management**: React Context

## Project Structure

```
src/
├── components/        # React components
├── context/          # Context providers
├── services/         # API services
├── types/            # TypeScript definitions
└── lib/             # Utility functions
```

## API Integration

This project uses the NIH Clinical Tables API for medical data:
- Endpoint: https://clinicaltables.nlm.nih.gov/api/conditions/v3
- Documentation: [NIH Clinical Tables API Documentation](https://clinicaltables.nlm.nih.gov/apidoc/conditions/v3/doc.html)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Disclaimer

This application is for informational purposes only and should not be considered medical advice. Always consult with a qualified healthcare professional for medical concerns.

## Acknowledgments

- NIH Clinical Tables API for medical data
- React and TypeScript communities
- Tailwind CSS for styling utilities
- Lucide for beautiful icons****
