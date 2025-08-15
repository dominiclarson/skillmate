import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter, useSearchParams } from "next/navigation";
import SignupPage from "@/app/signup/page";
import { toast } from "react-toastify";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

global.fetch = jest.fn();

describe("SignInPage", () => {
  const mockPush = jest.fn();
  const mockGet = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({
      push: mockPush,
    });
    useSearchParams.mockReturnValue({
      get: mockGet,
    });
    mockGet.mockReturnValue('/');
    jest.clearAllMocks();
  });

  it("renders sign in form with all elements", () => {
    render(<SignupPage />);

    expect(screen.getByText("Create Account")).toBeInTheDocument();
    expect(
      screen.getByText("Sign up to join SkillMate community")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("First name")).toBeInTheDocument();
    expect(screen.getByLabelText("Last name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Log in" })).toBeInTheDocument();
  });

  it("has correct input placeholders", () => {
    render(<SignupPage />);

    expect(screen.getByPlaceholderText("joe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("At least 6 characters")
    ).toBeInTheDocument();
  });

  it("handle successful sign up", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });
    render(<SignupPage />);

    const firstNameInput = screen.getByLabelText("First name");
    const lastNameInput = screen.getByLabelText("Last name");
    const emailInput = screen.getByLabelText("Email address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign Up" });

    fireEvent.change(firstNameInput, { target: { value: "Test" } });
    fireEvent.change(lastNameInput, { target: { value: "User" } });
    fireEvent.change(emailInput, {
      target: { value: "testnewuser1@gmail.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "testtest" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          firstName: "Test",
          lastName: "User",
          email: "testnewuser1@gmail.com",
          password: "testtest",
        }),
        headers: { "Content-Type": "application/json" },
      });
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("handle sign up failure (duplicate email)", async () => {
    fetch.mockResolvedValueOnce({
      ok: false, // ← 失敗レスポンス
      json: async () => ({ error: "Email already in use" }),
    });
    render(<SignupPage />);

    const firstNameInput = screen.getByLabelText("First name");
    const lastNameInput = screen.getByLabelText("Last name");
    const emailInput = screen.getByLabelText("Email address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign Up" });

    fireEvent.change(firstNameInput, { target: { value: "Test" } });
    fireEvent.change(lastNameInput, { target: { value: "User" } });
    fireEvent.change(emailInput, {
      target: { value: "testnewuser@gmail.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "testtest" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Email already in use");
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
