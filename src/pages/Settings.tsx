import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MapPin, Edit, Settings as SettingsIcon, LogOut, Shield, ChevronRight, MessageCircle, User, Activity, Sparkles, ArrowLeft, Save, Camera, Upload, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { API } from "@/lib/api";
import { getDefaultAvatar, compressImage } from "@/lib/utils";

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
        photos: [] as string[],
        hobbies: "",
        favoriteActivities: "",
        zodiacSign: "",
        religion: "",
        children: "",
        height: "",
        weight: "",
        eyeColor: "",
        hairColor: "",
        smoke: "",
        alcohol: "",
        locationCoords: { type: "Point", coordinates: [0, 0] },
        country: "",
        department: "",
        city: "",
    });
    const [passwords, setPasswords] = useState({ current: "", new: "" });

    useEffect(() => {
        const rawUser = localStorage.getItem("user");
        if (rawUser) {
            const user = JSON.parse(rawUser);
            // Ensure photo is in photos array if it's the only one
            const currentPhoto = user.photo || null;
            let currentPhotos = user.photos || [];
            if (currentPhoto && !currentPhotos.includes(currentPhoto)) {
                currentPhotos = [currentPhoto, ...currentPhotos];
            }

            setFormData({
                name: user.name || "",
                gender: user.gender || "",
                lookingFor: user.lookingFor || "",
                ageRange: user.ageRange || "",
                location: user.location || "",
                age: user.age || "",
                bio: user.bio || "",
                photo: currentPhoto,
                photos: currentPhotos,
                hobbies: user.hobbies || "",
                favoriteActivities: user.favoriteActivities || "",
                zodiacSign: user.zodiacSign || "",
                religion: user.religion || "",
                children: user.children || "",
                height: user.height || "",
                weight: user.weight || "",
                eyeColor: user.eyeColor || "",
                hairColor: user.hairColor || "",
                smoke: user.smoke || "",
                alcohol: user.alcohol || "",
                locationCoords: user.locationCoords || { type: "Point", coordinates: [0, 0] },
                country: user.country || "",
                department: user.department || "",
                city: user.city || "",
            });
        } else {
            navigate("/auth");
        }
    }, [navigate]);

    const getLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData(prev => ({
                        ...prev,
                        locationCoords: { type: "Point", coordinates: [longitude, latitude] }
                    }));
                    toast.success("Position récupérée !");
                },
                (error) => {
                    toast.error("Impossible de récupérer la position.");
                }
            );
        } else {
            toast.error("La géolocalisation n'est pas supportée par votre navigateur.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64 = await compressImage(file);
                const newPhotos = [...formData.photos, base64];
                setFormData(prev => ({ 
                    ...prev, 
                    photos: newPhotos,
                    photo: prev.photo || base64 
                }));
            } catch (err) {
                toast.error("Erreur de traitement de l'image.");
            }
        }
    };

    const removePhoto = (index: number) => {
        console.log("Removing photo at index:", index);
        const photoToRemove = formData.photos[index];
        const newPhotos = formData.photos.filter((_, i) => i !== index);
        
        let newPrimaryPhoto = formData.photo;
        if (formData.photo === photoToRemove) {
            newPrimaryPhoto = newPhotos.length > 0 ? newPhotos[0] : null;
        }

        console.log("New photos array length:", newPhotos.length);
        console.log("New primary photo:", newPrimaryPhoto ? "present" : "null");

        setFormData(prev => ({ 
            ...prev, 
            photos: newPhotos,
            photo: newPrimaryPhoto
        }));
        toast.info("Photo retirée de la liste. N'oubliez pas d'enregistrer.");
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Saving profile with data:", { ...formData, photos: formData.photos.length, photo: formData.photo ? "present" : "null" });
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            console.log("Using API:", `${API}/users/me`);
            const res = await fetch(`${API}/users/me`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            console.log("Save Response:", data);
            if (!res.ok) throw new Error(data.message);

            // Update local storage so changes persist instantly everywhere
            localStorage.setItem("user", JSON.stringify(data.user));
            const { gender, lookingFor, ageRange, location } = formData;
            localStorage.setItem("matchPrefs", JSON.stringify({ gender, lookingFor, ageRange, location }));

            toast.success("Profil mis à jour avec succès ! 🎉");
            setTimeout(() => navigate("/profile"), 1000);
        } catch (err: any) {
            console.error("Save Error Detail:", err);
            toast.error(`Erreur: ${err.message || "Impossible d'enregistrer"}`);
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

                    {/* Photos Section */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium text-foreground">Photos de profil (ajoutez-en plusieurs !)</label>
                        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
                            {formData.photos.map((photo, index) => (
                                <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-muted">
                                    <img src={photo} alt={`Profil ${index + 1}`} className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removePhoto(index)}
                                        className="absolute top-1 right-1 rounded-full bg-rose-500 p-2 text-white shadow-lg z-10"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    {formData.photo === photo && (
                                        <div className="absolute bottom-1 left-1 bg-primary px-1.5 py-0.5 rounded text-[10px] text-white font-bold">
                                            Principal
                                        </div>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary"
                            >
                                <Camera className="h-6 w-6 mb-1" />
                                <span className="text-[10px] font-bold">Ajouter</span>
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
                        <h2 className="text-lg font-bold text-foreground mb-4">Ma Localisation</h2>
                        <div className="grid gap-6">
                            <div className="space-y-4">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={getLocation}
                                    className="w-full flex items-center justify-center gap-2"
                                >
                                    <MapPin className="h-4 w-4" />
                                    {formData.locationCoords.coordinates[0] !== 0 ? "Mettre à jour ma position" : "Obtenir ma position actuelle"}
                                </Button>
                                {formData.locationCoords.coordinates[0] !== 0 && (
                                    <p className="text-[10px] text-muted-foreground text-center">
                                        Coordonnées : {formData.locationCoords.coordinates[1].toFixed(4)}, {formData.locationCoords.coordinates[0].toFixed(4)}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Pays</label>
                                    <Input name="country" value={formData.country} onChange={handleChange} placeholder="ex: France, Belgique..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Département / Région</label>
                                    <Input name="department" value={formData.department} onChange={handleChange} placeholder="ex: Île-de-France, PACA..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Ville</label>
                                    <Input name="city" value={formData.city} onChange={handleChange} placeholder="ex: Paris, Lyon..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Adresse affichée (Public)</label>
                                    <Input name="location" value={formData.location} onChange={handleChange} placeholder="ex: Paris, France" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Loisirs (Hobbies)</label>
                                <Input name="hobbies" value={formData.hobbies} onChange={handleChange} placeholder="ex: Musique, Voyage, Cuisine" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Activités Préférées</label>
                                <Input name="favoriteActivities" value={formData.favoriteActivities} onChange={handleChange} placeholder="ex: Randonnée, Lecture, Cinéma" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Signe Astrologique</label>
                                <select name="zodiacSign" value={formData.zodiacSign} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                    <option value="">Sélectionner</option>
                                    {["Bélier", "Taureau", "Gémeaux", "Cancer", "Lion", "Vierge", "Balance", "Scorpion", "Sagittaire", "Capricorne", "Verseau", "Poissons"].map(z => (
                                        <option key={z} value={z}>{z}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Religion</label>
                                <Input name="religion" value={formData.religion} onChange={handleChange} placeholder="ex: Chrétien, Musulman, etc." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Enfants</label>
                                <select name="children" value={formData.children} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                    <option value="">Sélectionner</option>
                                    <option value="none">Aucun</option>
                                    <option value="want">En veut</option>
                                    <option value="have">En a déjà</option>
                                    <option value="dont_want">N'en veut pas</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4">Apparence</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Taille (cm)</label>
                                <Input name="height" value={formData.height} onChange={handleChange} placeholder="ex: 175" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Poids (kg)</label>
                                <Input name="weight" value={formData.weight} onChange={handleChange} placeholder="ex: 70" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Couleur des Yeux</label>
                                <Input name="eyeColor" value={formData.eyeColor} onChange={handleChange} placeholder="ex: Marron, Bleu" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Couleur des Cheveux</label>
                                <Input name="hairColor" value={formData.hairColor} onChange={handleChange} placeholder="ex: Noir, Blond" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border">
                        <h2 className="text-lg font-bold text-foreground mb-4">Mode de Vie</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Fumeur</label>
                                <select name="smoke" value={formData.smoke} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                    <option value="">Sélectionner</option>
                                    <option value="no">Non</option>
                                    <option value="occasionally">Occasionnellement</option>
                                    <option value="yes">Oui</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Alcool</label>
                                <select name="alcohol" value={formData.alcohol} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                    <option value="">Sélectionner</option>
                                    <option value="never">Jamais</option>
                                    <option value="occasionally">Occasionnellement</option>
                                    <option value="regularly">Régulièrement</option>
                                </select>
                            </div>
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
