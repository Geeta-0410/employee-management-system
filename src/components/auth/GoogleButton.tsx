import React from "react";

interface GoogleButtonProps {
  onClick: () => void;
  loading?: boolean;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({
  onClick,
  loading = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      style={{
        width: "100%",
        color:"white",
        padding: "12px",
        marginTop: "16px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        background: "#2f56da",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: 500,
      }}
    >
      {loading ? "Please wait..." : "Continue with Google"}
    </button>
  );
};

export default GoogleButton;