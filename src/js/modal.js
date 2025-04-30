export class Modal {
  constructor() {
    // Create modal elements
    this.modalContainer = document.createElement("div");
    this.modalContent = document.createElement("div");
    this.modalTitle = document.createElement("h2");
    this.modalDescription = document.createElement("p");
    this.closeButton = document.createElement("button");

    // Setup modal structure
    this.modalContainer.appendChild(this.modalContent);
    this.modalContent.appendChild(this.modalTitle);
    this.modalContent.appendChild(this.modalDescription);
    this.modalContent.appendChild(this.closeButton);

    // Add classes for styling
    this.modalContainer.className = "memory-modal-container";
    this.modalContent.className = "memory-modal-content";
    this.modalTitle.className = "memory-modal-title";
    this.modalDescription.className = "memory-modal-description";
    this.closeButton.className = "memory-modal-close";

    // Set initial content
    this.closeButton.textContent = "Fechar";

    // Add event listener for close button
    this.closeButton.addEventListener("click", this.hide.bind(this));

    // Initially hide the modal
    this.modalContainer.style.display = "none";

    // Add the modal to the document body
    document.body.appendChild(this.modalContainer);

    // Apply styles
    this.applyStyles();
  }

  applyStyles() {
    // Modal container styles
    Object.assign(this.modalContainer.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "1000",
      opacity: "0",
      transition: "opacity 0.3s ease",
    });

    // Modal content styles
    Object.assign(this.modalContent.style, {
      backgroundColor: "#fff",
      padding: "30px",
      borderRadius: "8px",
      maxWidth: "500px",
      width: "80%",
      maxHeight: "80vh",
      overflow: "auto",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
      position: "relative",
      transform: "scale(0.8)",
      transition: "transform 0.3s ease",
      color: "#333",
    });

    // Title styles
    Object.assign(this.modalTitle.style, {
      marginTop: "0",
      fontSize: "24px",
      color: "#222",
      borderBottom: "2px solid #f0f0f0",
      paddingBottom: "10px",
      marginBottom: "15px",
    });

    // Description styles
    Object.assign(this.modalDescription.style, {
      fontSize: "16px",
      lineHeight: "1.6",
      marginBottom: "25px",
    });

    // Close button styles
    Object.assign(this.closeButton.style, {
      padding: "8px 16px",
      backgroundColor: "#4a5568",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "bold",
      transition: "background-color 0.2s",
      display: "block",
      marginLeft: "auto",
    });

    // Add hover effect for close button using event listeners
    this.closeButton.addEventListener("mouseover", () => {
      this.closeButton.style.backgroundColor = "#2d3748";
    });

    this.closeButton.addEventListener("mouseout", () => {
      this.closeButton.style.backgroundColor = "#4a5568";
    });

    // Responsive adjustments
    this.handleResponsiveDesign();
    window.addEventListener("resize", this.handleResponsiveDesign.bind(this));
  }

  handleResponsiveDesign() {
    if (window.innerWidth <= 600) {
      // Mobile adjustments
      Object.assign(this.modalContent.style, {
        width: "95%",
        padding: "20px",
      });

      Object.assign(this.modalTitle.style, {
        fontSize: "20px",
      });

      Object.assign(this.modalDescription.style, {
        fontSize: "14px",
      });
    } else {
      // Desktop defaults
      Object.assign(this.modalContent.style, {
        width: "80%",
        padding: "30px",
      });

      Object.assign(this.modalTitle.style, {
        fontSize: "24px",
      });

      Object.assign(this.modalDescription.style, {
        fontSize: "16px",
      });
    }
  }

  show(memoryDetails) {
    // Update content
    this.modalTitle.textContent = memoryDetails.title || "Memory";
    this.modalDescription.textContent =
      memoryDetails.description || "No description available.";

    // Show the modal
    this.modalContainer.style.display = "flex";

    // Add a small delay before adding the 'active' class for animation
    setTimeout(() => {
      this.modalContainer.style.opacity = "1";
      this.modalContent.style.transform = "scale(1)";
    }, 10);

    // Add escape key listener
    document.addEventListener("keydown", this.handleEscKey);
  }

  // Method to handle escape key press
  handleEscKey = (event) => {
    if (event.key === "Escape") {
      this.hide();
    }
  };

  hide() {
    // Start hiding animation
    this.modalContainer.style.opacity = "0";
    this.modalContent.style.transform = "scale(0.8)";

    // After animation completes, actually hide the element
    setTimeout(() => {
      this.modalContainer.style.display = "none";
    }, 300);

    // Remove escape key listener
    document.removeEventListener("keydown", this.handleEscKey);
  }
}
