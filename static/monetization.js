if (document.monetization) {
  document.monetizationExtensionInstalled = true;
} else {
  document.monetization = document.createElement('div');
  document.monetization.state = 'stopped';
}
