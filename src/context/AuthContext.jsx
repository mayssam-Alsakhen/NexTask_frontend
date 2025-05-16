"use client";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.get("http://127.0.0.1:8000/api/me", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                if (response.data) {
                    setUser(response.data); 
                } else {
                    console.warn("User data not found in response");
                    setUser(null); 
                }
            })
            .catch((error) => {
                console.error("Error fetching user:", error);
                localStorage.removeItem("token"); 
                setUser(null); 
            })
            .finally(() => {
                setLoading(false); 
            });
        } else {
            setLoading(false); 
        }
    }, []);
    
    

    // Define a login function
    const login = (userData, token) => {
        setUser(userData); // Set user data on login
        localStorage.setItem("token", token); // Store token in localStorage
    };

    // Define a logout function
    const logout = () => {
        setUser(null); // Remove user data on logout
        localStorage.removeItem("token"); // Remove the token from localStorage
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
