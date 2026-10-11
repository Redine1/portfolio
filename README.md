# Redine Kyle Villabito Elejorde — Personal Portfolio

Production-ready, highly responsive personal developer portfolio website designed for **Redine Kyle Villabito Elejorde**, a 21-year-old Computer Engineering Student at **ICCT Colleges**.

---

## 🚀 Quick Setup & GitHub Pages Deployment Guide

Follow these steps to deploy this portfolio for free on **GitHub Pages**:

### Step 1: Add Your Profile Picture
1. Save your desired profile picture as **`profile.jpg`**.
2. Place `profile.jpg` in the root folder alongside `index.html`.
> *Note: If `profile.jpg` is not added yet, the site automatically renders a stylized fallback technical avatar without breaking.*

### Step 2: Customize Your Contact & Social Links
Open `index.html` and search for:
- `redine.elejorde@example.com` → Replace with your real email address.
- `https://github.com` → Update with your GitHub profile URL (`https://github.com/your-username`).
- `https://linkedin.com` → Update with your LinkedIn profile URL.

---

### Step 3: Create GitHub Repository & Push Files

1. Open your terminal or PowerShell inside this folder:
   ```powershell
   cd C:\Users\Red\.gemini\antigravity\scratch\portfolio-redine
   ```
2. Initialize git:
   ```powershell
   git init
   git add .
   git commit -m "Initial commit: Redine Kyle Portfolio"
   ```
3. Go to [GitHub](https://github.com) and create a new public repository (e.g., `portfolio` or `redinekyle-portfolio`).
4. Link your remote repository and push:
   ```powershell
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
   git push -u origin main
   ```

---

### Step 4: Enable Free Hosting on GitHub Pages

1. In your GitHub repository, go to **Settings** (tab at the top).
2. On the left navigation sidebar, click **Pages** (under the "Code and automation" section).
3. Under **Build and deployment**:
   - **Source:** Select `Deploy from a branch`.
   - **Branch:** Select `main` and folder `/ (root)`.
4. Click **Save**.
5. Wait 1 to 2 minutes. GitHub will display your live portfolio URL:
   ```
   https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/
   ```

---

## 🛠 Features & Architecture
- **Theme:** Sleek Developer Dark Mode (`slate-950` with vibrant cyan, emerald, and indigo accents).
- **Styling:** Tailwind CSS via CDN (zero build step required).
- **Icons:** FontAwesome 6 & Devicon CDN for official tech icons.
- **Projects Highlighted:**
  - *NeuroComm Board* (ESP32, Custom Circuits, Hardware Design, C/C++)
  - *Solar-Powered Subsurface Irrigation System* (On-Going Thesis Capstone)
  - *FLOODGUARD* (Python, Kotlin, Android Studio, FastAPI)
  - *Event Management System* (Java, JavaSwing, MySQL)
  - *Black Onyx Cafe Pre-Ordering System* (HTML, CSS, JS, MySQL)
- **Interactive Skills Grid:** Official icons with smooth floating hover tooltips.
- **One-Click Email Copy:** Built-in clipboard copying with instant visual toast notification.
- **Responsive:** 100% mobile, tablet, and desktop ready.
