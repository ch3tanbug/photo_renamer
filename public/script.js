async function uploadPhotos() {
  const fileInput = document.getElementById('fileInput');
  const files = fileInput.files;

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('photos', files[i]);
  }

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
    });

    const renamedFiles = await response.json();

    // Automatically trigger download for each renamed file
    renamedFiles.forEach(file => {
      const blob = new Blob([file.buffer], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.download = file.name; // Set the new name for download
      link.href = URL.createObjectURL(blob); // Create a Blob URL for the file
      document.body.appendChild(link);
      link.click(); // Trigger the download
      document.body.removeChild(link); // Clean up
      URL.revokeObjectURL(link.href); // Free up memory
    });

    alert('Photos renamed and downloaded successfully!');
  } catch (error) {
    console.error('Error uploading photos:', error);
    alert('Error uploading photos');
  }
}