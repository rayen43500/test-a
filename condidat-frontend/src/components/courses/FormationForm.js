import React, { useEffect, useState } from "react";
import courseService from "../../services/courseService";

const FormationForm = ({ formationId, isEditMode }) => {
  const [formation, setFormation] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    duration: "",
    max_participants: "",
    start_date: "",
    end_date: "",
    price: "",
    requirements: [""],
    learningPoints: [""],
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Charger la formation existante si en mode édition
    const getFormation = async () => {
      if (!formationId) return;
      try {
        const res = await courseService.getFormation(formationId);
        setFormation(res.data);
        if (res.data.image) {
          setImagePreview(res.data.image);
        }
      } catch (err) {
        console.error("Erreur getFormation:", err);
      }
    };

    // Charger les catégories - CORRECTION: URL correcte
    const loadCategories = async () => {
      try {
        const res = await courseService.getCategories(); // ✅ URL corrigée
        console.log("Catégories reçues:", res); // Debug
        if (Array.isArray(res)) {
          setCategories(res);
        } else if (res.results && Array.isArray(res.results)) {
          setCategories(res.results);
        } else {
          console.warn("Format inattendu:", res);
          setCategories([]);
        }
      } catch (err) {
        console.error("Erreur loadCategories:", err);
        setCategories([]);
      }
    };

    loadCategories();
    if (isEditMode) getFormation();
  }, [isEditMode, formationId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormation({ ...formation, image: file });
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert("Vous devez être connecté pour créer une formation.");
      return;
    }
    
    try {
      // Validation des dates
      if (formation.start_date && formation.end_date) {
        const startDate = new Date(formation.start_date);
        const endDate = new Date(formation.end_date);
        if (endDate <= startDate) {
          alert("La date de fin doit être après la date de début.");
          return;
        }
      }

      // Validation du prix
      if (formation.price && parseFloat(formation.price) < 0) {
        alert("Le prix ne peut pas être négatif.");
        return;
      }

      // Préparer les données pour l'envoi
      const formationData = {
        title: formation.title,
        description: formation.description,
        category: formation.category,
        level: formation.level,
        duration: parseInt(formation.duration),
        max_participants: parseInt(formation.max_participants),
        start_date: formation.start_date,
        end_date: formation.end_date,
        price: parseFloat(formation.price),
        image: formation.image,
        requirements: formation.requirements.filter(req => req.trim()),
        learning_points: formation.learningPoints.filter(lp => lp.trim()),
        // Champs requis par le modèle mais non utilisés dans le formulaire
        language: 'Français',
        discount: 0,
        location: 'Online'
      };

      if (isEditMode) {
        await courseService.updateFormation(formationId, formationData);
        alert("Formation modifiée avec succès !");
      } else {
        await courseService.createFormation(formationData);
        alert("Formation créée avec succès !");
      }
    } catch (err) {
      console.error("Erreur handleSubmit:", err);
      alert("Erreur lors de l'enregistrement de la formation.");
    }
  };

  const handleArrayChange = (field, index, value) => {
    const updated = [...formation[field]];
    updated[index] = value;
    setFormation({ ...formation, [field]: updated });
  };

  const addArrayField = (field) => {
    setFormation({ ...formation, [field]: [...formation[field], ""] });
  };

  const removeArrayField = (field, index) => {
    const updated = [...formation[field]];
    updated.splice(index, 1);
    setFormation({ ...formation, [field]: updated });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        {isEditMode ? "Modifier une formation" : "Créer une formation"}
      </h2>

      {/* Titre */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Titre</label>
        <input
          type="text"
          placeholder="Titre"
          value={formation.title}
          onChange={(e) => setFormation({ ...formation, title: e.target.value })}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          placeholder="Description"
          value={formation.description}
          onChange={(e) =>
            setFormation({ ...formation, description: e.target.value })
          }
          required
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Catégorie */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Catégorie</label>
        <select
          value={formation.category || ""}
          onChange={(e) =>
            setFormation({ ...formation, category: e.target.value })
          }
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">Sélectionner une catégorie</option>
          {console.log("Catégories à afficher:", categories.length, categories)}
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Niveau */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Niveau</label>
        <select
          value={formation.level}
          onChange={(e) => {
            console.log("Niveau sélectionné:", e.target.value); // Debug
            setFormation({ ...formation, level: e.target.value });
          }}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">Sélectionner un niveau</option>
          <option value="beginner">Débutant</option>
          <option value="intermediate">Intermédiaire</option>
          <option value="advanced">Avancé</option>
        </select>
      </div>

      {/* Nombre d'heures */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre d'heures</label>
        <input
          type="number"
          placeholder="Ex: 40"
          value={formation.duration}
          onChange={(e) =>
            setFormation({ ...formation, duration: e.target.value })
          }
          required
          min="1"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Nombre de participants */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre de participants</label>
        <input
          type="number"
          placeholder="Ex: 20"
          value={formation.max_participants}
          onChange={(e) =>
            setFormation({ ...formation, max_participants: e.target.value })
          }
          required
          min="1"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Date de début */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Date de début</label>
        <input
          type="date"
          value={formation.start_date}
          onChange={(e) =>
            setFormation({ ...formation, start_date: e.target.value })
          }
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Date de fin */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Date de fin</label>
        <input
          type="date"
          value={formation.end_date}
          onChange={(e) =>
            setFormation({ ...formation, end_date: e.target.value })
          }
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Prix */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Prix (€)</label>
        <input
          type="number"
          placeholder="Ex: 299"
          value={formation.price}
          onChange={(e) =>
            setFormation({ ...formation, price: e.target.value })
          }
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Image de la formation</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Aperçu"
              className="w-32 h-32 object-cover rounded-md border"
            />
          </div>
        )}
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Prérequis <span className="text-gray-500">(optionnel)</span></label>
        {formation.requirements.map((req, i) => (
          <div key={i} className="flex items-center mt-2 space-x-2">
            <input
              type="text"
              value={req}
              onChange={(e) =>
                handleArrayChange("requirements", i, e.target.value)
              }
              className="flex-1 border border-gray-300 rounded-md p-2"
            />
            {formation.requirements.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayField("requirements", i)}
                className="text-red-500"
              >
                Supprimer
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayField("requirements")}
          className="mt-2 text-blue-600"
        >
          + Ajouter un prérequis
        </button>
      </div>

      {/* Learning Points */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Points d'apprentissage <span className="text-gray-500">(optionnel)</span></label>
        {formation.learningPoints.map((lp, i) => (
          <div key={i} className="flex items-center mt-2 space-x-2">
            <input
              type="text"
              value={lp}
              onChange={(e) =>
                handleArrayChange("learningPoints", i, e.target.value)
              }
              className="flex-1 border border-gray-300 rounded-md p-2"
            />
            {formation.learningPoints.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayField("learningPoints", i)}
                className="text-red-500"
              >
                Supprimer
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayField("learningPoints")}
          className="mt-2 text-blue-600"
        >
          + Ajouter un point d’apprentissage
        </button>
      </div>

      {/* Bouton */}
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
      >
        {isEditMode ? "Modifier" : "Créer"}
      </button>
    </form>
  );
};

export default FormationForm;
