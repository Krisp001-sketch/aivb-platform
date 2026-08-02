import '../app/globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'AIVB Platform | AI Asset Video Builder',
  description: 'Intelligent Video Assembly Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Load Paddle V2 SDK */}
        <Script
          src="https://cdn.paddle.com/paddle/v2/paddle.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-neutral-950 text-neutral-100 min-h-screen relative overflow-x-hidden antialiased">
        {/* Background Ambient Glows */}
        <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[600px] rounded-full bg-cyan-500/10 blur-[130px]" />
          <div className="absolute top-1/3 right-10 h-[350px] w-[350px] rounded-full bg-indigo-500/10 blur-[120px]" />
        </div>

        {/* Main Content Layer */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}