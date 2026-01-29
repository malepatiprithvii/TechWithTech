function Welcome() {
  return (
    <div>
      <h2>Welcome!</h2>
      <button onClick={() => window.location='/donate'}>Donate</button>
      <button onClick={() => window.location='/request'}>Request</button>
    </div>
  );
}
export default Welcome;
