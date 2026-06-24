import "./globals.css";

export const metadata = {
  title: "ChallengeForge",
  description: "Create consistent AI prompts and challenge graphics for community contests."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
