import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

const createFormState = (user) => ({
	name: user?.name ?? "",
	email: user?.email ?? "",
	bio: user?.bio ?? "",
	location: user?.location ?? "",
	website: user?.website ?? "",
});

const formatValue = (value) => value?.trim() || "Not provided";

export default function Profile() {
	const navigate = useNavigate();
	const { user, updateUser } = useAuth();
	const [editing, setEditing] = useState(false);
	const [form, setForm] = useState(() => createFormState(user));

	useEffect(() => {
		setForm(createFormState(user));
	}, [user]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((currentForm) => ({
			...currentForm,
			[name]: value,
		}));
	};

	const handleSave = (event) => {
		event.preventDefault();
		updateUser({ ...user, ...form });
		setEditing(false);
	};

	const handleCancel = () => {
		setForm(createFormState(user));
		setEditing(false);
	};

	const userName = user?.name?.trim() || "User";
	const avatarInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

	return (
		<section className="profile-page">
			<div className="profile-card">
				<div className="profile-actions">
					<button
						type="button"
						className="profile-back-button"
						onClick={() => navigate("/home")}
					>
						{"Back to Home"}
					</button>

					<button
						type="button"
						className="profile-edit-toggle"
						onClick={() => setEditing((currentValue) => !currentValue)}
					>
						{editing ? "Hide Edit Profile" : "Edit Profile"}
					</button>
				</div>

				<div className="profile-header">
					<div className="profile-avatar" aria-hidden="true">
						{avatarInitial}
					</div>

					<div className="profile-header-copy">
						<h1 className="profile-title">{userName}</h1>
						<p className="profile-subtitle">Manage your ThreadHive profile details.</p>
					</div>
				</div>

				{editing ? (
					<form className="profile-form" onSubmit={handleSave}>
						<div className="profile-field-group">
							<label className="profile-label" htmlFor="name">
								Name
							</label>
							<input
								id="name"
								name="name"
								type="text"
								className="profile-input"
								value={form.name}
								onChange={handleChange}
							/>
						</div>

						<div className="profile-field-group">
							<label className="profile-label" htmlFor="email">
								Email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								className="profile-input"
								value={form.email}
								disabled
								readOnly
							/>
						</div>

						<div className="profile-field-group">
							<label className="profile-label" htmlFor="bio">
								Bio
							</label>
							<textarea
								id="bio"
								name="bio"
								className="profile-input profile-textarea"
								rows="4"
								value={form.bio}
								onChange={handleChange}
							/>
						</div>

						<div className="profile-field-group">
							<label className="profile-label" htmlFor="location">
								Location
							</label>
							<input
								id="location"
								name="location"
								type="text"
								className="profile-input"
								value={form.location}
								onChange={handleChange}
							/>
						</div>

						<div className="profile-field-group">
							<label className="profile-label" htmlFor="website">
								Website
							</label>
							<input
								id="website"
								name="website"
								type="url"
								className="profile-input"
								value={form.website}
								onChange={handleChange}
							/>
						</div>

						<div className="profile-form-actions">
							<button type="submit" className="profile-save-button">
								Save Profile
							</button>
							<button
								type="button"
								className="profile-cancel-button"
								onClick={handleCancel}
							>
								Cancel
							</button>
						</div>
					</form>
				) : (
					<div className="profile-details">
						<div className="profile-field-row">
							<span className="profile-field-label">Name</span>
							<span className="profile-field-value">{formatValue(user?.name)}</span>
						</div>

						<div className="profile-field-row">
							<span className="profile-field-label">Email</span>
							<span className="profile-field-value">{formatValue(user?.email)}</span>
						</div>

						<div className="profile-field-row">
							<span className="profile-field-label">Bio</span>
							<span className="profile-field-value">{formatValue(user?.bio)}</span>
						</div>

						<div className="profile-field-row">
							<span className="profile-field-label">Location</span>
							<span className="profile-field-value">{formatValue(user?.location)}</span>
						</div>

						<div className="profile-field-row">
							<span className="profile-field-label">Website</span>
							<span className="profile-field-value">{formatValue(user?.website)}</span>
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
