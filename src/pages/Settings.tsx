import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Camera, Upload, Heart } from "lucide-react";
import { toast } from "sonner";
import { API } from "@/lib/api";

export default function Settings() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        lookingFor: "",
        ageRange: "",
        location: "",
        age: "",
        bio: "",
        photo: "" as string | null,
    });
    const [passwords, setPasswords] = useState({ current: "", new: "" });

    useEffect(() => {
        const rawUser = localStorage.getItem("user");
        if (rawUser) {
            const user = JSON.parse(rawUser);
            setFormData({
                name: user.name || "",
                gender: user.gender || "",
                lookingFor: user.lookingFor || "",
                ageRange: user.ageRange || "",
                location: user.location || "",
                age: user.age || "",
                bio: user.bio || "",
                photo: user.photo || null,
            });
        } else {
            navigate("/auth");
        }
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData({ ...formData, photo: reader.result as string });
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/users/me`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            // Update local storage so changes persist instantly everywhere
            localStorage.setItem("user", JSON.stringify(data.user));
            const { gender, lookingFor, ageRange, location } = formData;
            localStorage.setItem("matchPrefs", JSON.stringify({ gender, lookingFor, ageRange, location }));

            toast.success("Profil mis à jour avec succès ! 🎉");
            setTimeout(() => navigate("/profile"), 1000);
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Erreur lors de la sauvegarde.");
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwords.current || !passwords.new) return;
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API}/auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.new
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success("Mot de passe mis à jour ! 🎉");
            setPasswords({ current: "", new: "" });
        } catch (err: any) {
            toast.error(err.message || "Erreur lors du changement de mot de passe.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl px-4 pb-20 pt-8 md:pt-24">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold text-foreground">Modifier le Profil</h1>
                </div>
                <Button onClick={handleSave} disabled={saving} className="rounded-xl px-6">
                    {saving ? "Sauvegarde..." : <><Save className="mr-2 h-4 w-4" /> Enregistrer</>}
                </Button>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <form onSubmit={handleSave} className="space-y-6">

                    {/* Photo Upload */}
                    <div className="flex flex-col items-center">
                        <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-muted flex items-center justify-center bg-muted/50">
                            {formData.photo ? (
                                <img src={formData.photo} alt="Profil" className="h-full w-full object-cover" />
                            ) : (
                                <Camera className="h-10 w-10 text-muted-foreground/50" />
                            )}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-1 right-1 rounded-full bg-primary p-2 text-white shadow-md hover:bg-primary/90"
                            >
                                <Upload className="h-3 w-3" />
                            </button>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Nom d'affichage</label>
                            <Input name="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Âge</label>
                            <Input name="age" type="number" value={formData.age} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Bio</label>
                        <Textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Parlez-nous de vous, de vos passions..."
                            className="resize-none h-24"
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Mon genre</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="man">Homme</option>
                                <option value="woman">Femme</option>
                                <option value="other">Autre</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Je recherche</label>
                            <select
                                name="lookingFor"
                                value={formData.lookingFor}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="man">Homme</option>
                                <option value="woman">Femme</option>
                                <option value="everyone">Tout le monde</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Tranche d'âge cible</label>
                            <select
                                name="ageRange"
                                value={formData.ageRange}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="18–25">18–25</option>
                                <option value="25–35">25–35</option>
                                <option value="35–45">35–45</option>
                                <option value="45+">45+</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Localisation</label>
                            <Input name="location" value={formData.location} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="pt-6 border-t border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            Sécurité
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Ancien mot de passe</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Nouveau mot de passe</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                />
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="mt-4"
                            onClick={handleChangePassword}
                            disabled={!passwords.current || !passwords.new || saving}
                        >
                            Changer le mot de passe
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
