"use client";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Retrieve the user from the backend on page load
    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Token found in localStorage:", token); // Log the token
    
        if (token) {
            axios.get("http://127.0.0.1:8000/api/me", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                console.log("User data fetched:", response.data); // Log the user data
                if (response.data) {
                    setUser(response.data); // Set the user state with the response data
                } else {
                    console.warn("User data not found in response");
                    setUser(null); // If no user found, clear user state
                }
            })
            .catch((error) => {
                console.error("Error fetching user:", error);
                localStorage.removeItem("token"); // Remove token if the request fails
                setUser(null); // Clear the user state
            })
            .finally(() => {
                setLoading(false); // Done loading
            });
        } else {
            setLoading(false); // If no token, stop loading
        }
    }, []);
    
    

    // Define a login function
    const login = (userData, token) => {
        console.log("AuthContext: User logged in:", userData);
        setUser(userData); // Set user data on login
        localStorage.setItem("token", token); // Store token in localStorage
    };

    // Define a logout function
    const logout = () => {
        console.log("AuthContext: User logged out.");
        setUser(null); // Remove user data on logout
        localStorage.removeItem("token"); // Remove the token from localStorage
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
