import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Login from "./Login";
import { addUser } from "../utiles/userSlice";
import { auth } from "../utiles/fireBase";
import { URL_LOGIN } from "../utiles/constants";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const mockDispatch = jest.fn();

jest.mock("./Header", () => () => <div data-testid="header" />);
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));
jest.mock("../utiles/fireBase", () => ({
  auth: { currentUser: null },
}));
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
}));

const VALID_EMAIL = "test@example.com";
const VALID_PASSWORD = "Password1";

const type = (placeholder, value) => {
  fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value } });
};

const fillAuthFields = ({ name, email, password }) => {
  if (name !== undefined) type("Full name", name);
  type("Email Address", email);
  type("Password", password);
};

describe("Login async/await auth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    auth.currentUser = null;
  });

  test("invalid email does not call Firebase", async () => {
    render(<Login />);
    fillAuthFields({ name: "Ali", email: "not-an-email", password: VALID_PASSWORD });
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    expect(screen.getByText("Email is not Valid")).toBeInTheDocument();
    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });

  test("sign up: create user, then update profile, then addUser from currentUser", async () => {
    const fakeUser = { uid: "u1" };
    createUserWithEmailAndPassword.mockResolvedValue({ user: fakeUser });
    updateProfile.mockImplementation(async () => {
      auth.currentUser = {
        uid: "u1",
        email: VALID_EMAIL,
        displayName: "Ali",
        photoURL: URL_LOGIN,
      };
    });

    render(<Login />);
    fillAuthFields({ name: "Ali", email: VALID_EMAIL, password: VALID_PASSWORD });
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, VALID_EMAIL, VALID_PASSWORD);
      expect(updateProfile).toHaveBeenCalledWith(fakeUser, {
        displayName: "Ali",
        photoURL: URL_LOGIN,
      });
      expect(mockDispatch).toHaveBeenCalledWith(
        addUser({
          uid: "u1",
          email: VALID_EMAIL,
          displayName: "Ali",
          photoURL: URL_LOGIN,
        })
      );
    });
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });

  test("sign up does not addUser if createUser fails", async () => {
    createUserWithEmailAndPassword.mockRejectedValue({
      code: "auth/email-already-in-use",
      message: "email in use",
    });

    render(<Login />);
    fillAuthFields({ name: "Ali", email: VALID_EMAIL, password: VALID_PASSWORD });
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(screen.getByText("auth/email-already-in-use - email in use")).toBeInTheDocument();
    });
    expect(updateProfile).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  test("sign up does not addUser if updateProfile fails", async () => {
    createUserWithEmailAndPassword.mockResolvedValue({ user: { uid: "u1" } });
    updateProfile.mockRejectedValue({ code: "auth/requires-recent-login", message: "profile fail" });

    render(<Login />);
    fillAuthFields({ name: "Ali", email: VALID_EMAIL, password: VALID_PASSWORD });
    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));

    await waitFor(() => {
      expect(screen.getByText("auth/requires-recent-login - profile fail")).toBeInTheDocument();
    });
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  test("sign in only calls signIn and does not update profile or addUser", async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: { uid: "u2" } });

    render(<Login />);
    fireEvent.click(screen.getByText("Already registered? Sign In Now"));
    fillAuthFields({ email: VALID_EMAIL, password: VALID_PASSWORD });
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, VALID_EMAIL, VALID_PASSWORD);
    });
    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
    expect(updateProfile).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  test("sign in shows Firebase error", async () => {
    signInWithEmailAndPassword.mockRejectedValue({
      code: "auth/wrong-password",
      message: "bad password",
    });

    render(<Login />);
    fireEvent.click(screen.getByText("Already registered? Sign In Now"));
    fillAuthFields({ email: VALID_EMAIL, password: VALID_PASSWORD });
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(screen.getByText("auth/wrong-password - bad password")).toBeInTheDocument();
    });
  });
});
