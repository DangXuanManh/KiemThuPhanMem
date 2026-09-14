const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 PetCare Store Server running on http://localhost:${PORT}`);
  console.log(`📚 Swagger API Specs available on http://localhost:${PORT}/api-docs`);
});
