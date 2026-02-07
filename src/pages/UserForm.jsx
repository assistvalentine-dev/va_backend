import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../utils/api';
import { toast } from "react-toastify"; 

const UserForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    interestedIn: '',
    college: '',
    email: '',
    relationshipGoal: '',
    description: '',
    preferences: '',
    interests: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const age = parseInt(formData.age);
    if (!formData.age || age < 18 || age > 100) {
      newErrors.age = 'Age must be between 18 and 100';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    if (!formData.interestedIn) {
      newErrors.interestedIn = 'Please select who you are interested in';
    }

    if (!formData.college.trim()) {
      newErrors.college = 'College is required';
    }

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.relationshipGoal) {
      newErrors.relationshipGoal = 'Please select a relationship goal';
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.preferences.trim() || formData.preferences.trim().length < 10) {
      newErrors.preferences = 'Preferences must be at least 10 characters';
    }
    if (!formData.interests) {
      newErrors.interests = 'Please select an option';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // Prevent multiple submissions

    if (!validateForm()) {
      return;
    }


    setLoading(true);
    toast.info("Submitting your details..."); 


    try {
      const response = await createUser({
        ...formData,
        age: parseInt(formData.age),
      });

    if (response.success) {
      toast.success("Email sent successfully!"); 
      const { userId, email, paymentStatus, verifiedId } = response.data;
      sessionStorage.setItem('userId', userId);

      // Case 1 — user is not verified → go to OTP page
      if (!verifiedId) {
        navigate("/verify-otp", { state: { email, userId } });
        return;
      }

      // Case 2 — verified but needs payment (PENDING)
      if (paymentStatus === "PENDING") {
        navigate("/payment", { state: { email, userId } });
        return;
      }

      // Case 3 — FREE user → go straight to success
      if (paymentStatus === "FREE") {
        navigate("/success");
        return;
      }
    }
 else {
      toast.error(response.message || "Failed to create user"); 
      setErrors({ submit: response.message || 'Failed to create user ' });
    }
    } catch (error) {
      if (error.response?.data?.errors) {
        const apiErrors = {};
        error.response.data.errors.forEach((err) => {
          apiErrors[err.path || err.param] = err.msg;
          toast.error(err.msg);        // ✅ show each validation error as toast
        });
        setErrors(apiErrors);
      } else {
        const msg = error.response?.data?.message || "Server error. Please try again.";
        toast.error(msg);             // ✅ always toast backend message
        setErrors({ submit: msg });
      }
    }
  finally {    setLoading(false);}
  };

  return (
    <div className="min-h-screen py-12 px-4 relative">
       {/* ================== BLOCKING OVERLAY ================== */}
      {loading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-white font-semibold">Processing your request...</p>
            <p className="text-gray-400 text-sm mt-1">Please don’t refresh the page</p>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Tell Us About Yourself</h1>
          <p className="text-gray-400">Help us find your perfect match</p>
          <span className="text-sm text-romantic-600 mt-1 block"> *Your information is safe with us and will only be used to find compatible matches.*</span>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 space-y-6">
          {errors.submit && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="label-field">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="label-field">
              Age *
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your age"
              min="18"
              max="100"
            />
            {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age}</p>}
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="label-field">
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-red-400 text-sm mt-1">{errors.gender}</p>}
          </div>

          {/* Interested In */}
          <div>
            <label htmlFor="interestedIn" className="label-field">
              Interested In *
            </label>
            <select
              id="interestedIn"
              name="interestedIn"
              value={formData.interestedIn}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select preference</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Any">Any</option>
            </select>
            {errors.interestedIn && <p className="text-red-400 text-sm mt-1">{errors.interestedIn}</p>}
          </div>

          {/* College */}
          <div>
            <label htmlFor="college" className="label-field">
              College *
            </label>
            <select
              id="college"
              name="college"
              value={formData.college}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select your college</option>
              <option value="jk lakshmipat university">jk lakshmipat university</option>
              <option value="Manipal University Jaipur">Manipal University Jaipur</option>
              <option value="Other">Other</option>
              {/* Add more colleges as needed */}
            </select
            >
            {errors.college && <p className="text-red-400 text-sm mt-1">{errors.college}</p>}
          </div>


          {/* Email */}
          <div>
            <label htmlFor="email" className="label-field">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Relationship Goal */}
          <div>
            <label htmlFor="relationshipGoal" className="label-field">
              Relationship Goal *
            </label>
            <select
              id="relationshipGoal"
              name="relationshipGoal"
              value={formData.relationshipGoal}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select relationship goal</option>
              <option value="Casual">Casual</option>
              <option value="Serious">Serious</option>
              <option value="Marriage">Marriage</option>
            </select>
            {errors.relationshipGoal && <p className="text-red-400 text-sm mt-1">{errors.relationshipGoal}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="label-field">
              Short Self Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              rows="5"
              placeholder="Tell us about yourself, your interests, hobbies, and what makes you unique..."
            />
            <p className="text-gray-500 text-sm mt-1">
              {formData.description.length}/1000 characters
            </p>
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Preferences */}
          <div>
            <label htmlFor="preferences" className="label-field">
              Partner Preferences * 
            </label>
            <textarea
              id="preferences"
              name="preferences"
              value={formData.preferences}
              onChange={handleChange}
              className="input-field"
              rows="5"
              placeholder="Describe what you're looking for in a partner..."
            />
            <p className="text-gray-500 text-sm mt-1">
              {formData.preferences.length}/1000 characters
            </p>
            {errors.preferences && <p className="text-red-400 text-sm mt-1">{errors.preferences}</p>}
          </div>
          
          {/* Interests in other colleges*/}
          <div>
            <label htmlFor="interests" className="label-field">
              Interested in students from other colleges?
            </label>
                <input
                  type="radio"
                  name="interests"
                  value="Yes"
                  checked={formData.interests === 'Yes'}
                  onChange={handleChange}
                  className="form-radio text-romantic-500"
                />
                <span className="ml-2 text-gray-300">Yes</span>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="interests"
                  value="No"
                  checked={formData.interests === 'No'}
                  onChange={handleChange}
                  className="form-radio text-romantic-500"
                />
                <span className="ml-2 text-gray-300">No</span>
              </label>
            </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'verify email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;


