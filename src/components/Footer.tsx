import logo from "../assets/logo.jpeg";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border bg-card py-8">
            <div className="mx-auto max-w-6xl px-4">
                <div className="grid gap-12 lg:grid-cols-4">
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <img src={logo} alt="Amour Et Sincerité logo" className="h-10 w-10 rounded-xl object-cover shadow-lg" />
                            <span className="text-2xl font-black tracking-tighter text-foreground whitespace-nowrap">
                                Amour Et Sincerité<span className="text-primary">.</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground">
                            Helping you find meaningful connections and real love in the digital age.
                        </p>
                        <div className="mt-6 flex gap-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-4 font-bold text-foreground">Application</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/discover" className="hover:text-primary">Découvrir</Link></li>
                            <li><Link to="/messages" className="hover:text-primary">Messages</Link></li>
                            <li><Link to="/profile" className="hover:text-primary">Profil</Link></li>
                            <li><Link to="/match-setup" className="hover:text-primary">Configuration</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-bold text-foreground">Compagnie</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/" className="hover:text-primary">À propos</Link></li>
                            <li><Link to="/" className="hover:text-primary">Carrières</Link></li>
                            <li><Link to="/" className="hover:text-primary">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-bold text-foreground">Légal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/" className="hover:text-primary">Confidentialité</Link></li>
                            <li><Link to="/" className="hover:text-primary">Conditions</Link></li>
                            <li><Link to="/" className="hover:text-primary">Cookies</Link></li>
                            <li><Link to="/" className="hover:text-primary">Sécurité</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
                    <p>© {currentYear} Amour Et Sincérité. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}
