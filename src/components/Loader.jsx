const Loader = ({ message = "Cargando...", size = "medium" }) => {
  const loaderClass = `loader ${size}`;

  return (
    <div className="loader-container">
      <div className={loaderClass}>
        <div className="spinner"></div>
      </div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
};

export default Loader;