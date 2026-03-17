import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CircleUserRound } from "lucide-react";
import "./Auth.css";


export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [child, setChild] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
        try {
        const [profileRes, childRes] = await Promise.all([
            api.get("profile/"),
            api.get("child/"),
        ]);

        setProfile(profileRes.data);
        setChild(childRes.data);
        } catch (error) {
        console.error("Failed to load profile", error);
        }
    };

    loadData();
  }, []);

  const updateProfile = async () => {
    await api.patch("profile/", profile);
    alert("Profile updated");
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    delete api.defaults.headers.common["Authorization"];

    navigate("/");
 };

  if (!profile) return null;

  return (
    <>
      <Header />

      <div className="profile-page">
        <div className="profile-container">

          <div className="profile-form-card">
            <h2>Profile</h2>

            <div className="input-group">
              <label>Name</label>
              <input value={profile.first_name} disabled />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input value={profile.email} disabled />
            </div>

            <div className="input-group">
              <label>Birth Date</label>
              <input
                type="date"
                value={profile.birth_date || ""}
                onChange={(e) =>
                  setProfile({ ...profile, birth_date: e.target.value })
                }
              />
            </div>

            <div className="input-group">
              <label>Phone</label>
              <input
                value={profile.phone_number || ""}
                onChange={(e) =>
                  setProfile({ ...profile, phone_number: e.target.value })
                }
              />
            </div>

            <button className="primary-btn" onClick={updateProfile}>
              Save Changes
            </button>

            <hr style={{ margin: "40px 0" }} />

            <h3>Child Profile</h3>

            {!child && (
              <button
                className="primary-btn"
                onClick={() =>
                  setChild({ name: "", age: "", difficulty_level: 1 })
                }
              >
                + Create Child
              </button>
            )}

            {child && (
              <>
                <div className="input-group">
                  <label>Child Name</label>
                  <input
                    value={child.name || ""}
                    onChange={(e) =>
                      setChild({ ...child, name: e.target.value })
                    }
                  />
                </div>

                <div className="input-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={child.age || ""}
                    onChange={(e) =>
                      setChild({ ...child, age: e.target.value })
                    }
                  />
                </div>

                <div className="input-group">
                  <label>Difficulty Level</label>
                  <input
                    type="number"
                    value={child.difficulty_level || 1}
                    onChange={(e) =>
                      setChild({
                        ...child,
                        difficulty_level: e.target.value,
                      })
                    }
                  />
                </div>

                <button className="primary-btn">
                  Save Child
                </button>
              </>
            )}
          </div>

          <div className="profile-side-card">
            <CircleUserRound size={120} />
            <h3>{profile.first_name}</h3>
            <p style={{ color: "#64748B" }}>
              {profile.role === "parent"
                ? "Parent Account"
                : "Speech Therapist Account"}
            </p>
            <div className="profile-buttons">
              <button className="secondary-btn">
                Donate ❤️
              </button>

              <button className="secondary-btn" onClick={logout}>
                Logout
              </button>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}
