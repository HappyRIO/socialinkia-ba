

export default function Footer() {
  return (
    <footer className="py-6 bg-accent text-background">
      <div className="container mx-auto text-center space-y-4">
        <p>© {new Date().getFullYear()} Socialinkia. All rights reserved.</p>
        <div className="flex justify-center space-x-4">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>
        <a href="https://storyset.com/online">
          Online illustrations by Storyset
        </a>
      </div>
    </footer>
  );
}
