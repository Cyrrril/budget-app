import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      navigate("/");
    } else {
      alert("Registration failed! This account already exists");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pastel-yellow-100 dark:bg-pastel-purple-100 p-4 transition-colors duration-300">
      <Card className="w-full max-w-md shadow-2xl border-none bg-white dark:bg-pastel-purple-100 rounded-2xl transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-pastel-purple-500 dark:text-pastel-yellow-500">
            Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            // className="bg-white dark:bg-pastel-purple-800 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6 transition-all"
          >
            <div>
              <Label
                htmlFor="email"
                className="text-pastel-purple-400 dark:text-pastel-yellow-400"
              >
                Email
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                className="bg-pastel-purple-100 dark:bg-pastel-yellow-100 focus:ring-2 focus:ring-pastel-purple-300 dark:focus:ring-pastel-yellow-300"
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="text-pastel-purple-400 dark:text-pastel-yellow-400"
              >
                Password
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="bg-pastel-purple-100 dark:bg-pastel-yellow-100 focus:ring-2 focus:ring-pastel-purple-300 dark:focus:ring-pastel-yellow-300"
              />
            </div>
            <Button
              type="submit"
              className="mt-2 w-full bg-pastel-purple-500 hover:bg-pastel-purple-400 text-white dark:bg-pastel-yellow-500 dark:hover:bg-pastel-yellow-400 transition-colors"
            >
              Login
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a
            href="/"
            className="ml-1 text-pastel-purple-500 dark:text-pastel-yellow-500 hover:underline"
          >
            Log In
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
