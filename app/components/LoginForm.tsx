export default function LoginForm() {
  return (
    <div className="max-w-md mx-auto p-8 shadow-lg bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full" />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" className="w-full" />
        </div>
        <button type="submit" className="w-full">Login</button>
      </form>
    </div>
  );
}
