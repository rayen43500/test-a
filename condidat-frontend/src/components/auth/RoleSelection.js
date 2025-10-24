import React from 'react';
import { Link } from 'react-router-dom';
import { UserGroupIcon, BriefcaseIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const RoleSelection = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full space-y-10 text-center">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-800 drop-shadow-sm">Bienvenue sur SkillUp</h2>
          <p className="mt-3 text-gray-600 text-lg">Choisissez votre rôle pour commencer</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10">
          {/* Candidat */}
          <Link
            to="/register/candidat"
            className="group relative bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.15)] transform hover:-translate-y-2 transition-all duration-300 border border-blue-100"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200 transition-all shadow-inner">
                <UserGroupIcon className="h-10 w-10 text-blue-600" />
              </div>

              <h3 className="mt-6 text-2xl font-semibold text-gray-800">Je suis un Candidat</h3>
              <p className="mt-3 text-gray-500 leading-relaxed text-sm">
                Présentez vos compétences, postulez aux offres et trouvez l’emploi idéal.
              </p>

              <ul className="mt-5 space-y-2 text-gray-600 text-sm">
                {[
                  "Créez votre profil professionnel",
                  "Téléchargez votre CV",
                  "Postulez aux offres",
                  "Soyez repéré par les recruteurs",
                ].map((item, i) => (
                  <li key={i} className="flex items-center justify-center">
                    <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span> {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                S’inscrire comme candidat
                <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Recruteur */}
          <Link
            to="/register/recruteur"
            className="group relative bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.15)] transform hover:-translate-y-2 transition-all duration-300 border border-purple-100"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200 transition-all shadow-inner">
                <BriefcaseIcon className="h-10 w-10 text-purple-600" />
              </div>

              <h3 className="mt-6 text-2xl font-semibold text-gray-800">Je suis un Recruteur</h3>
              <p className="mt-3 text-gray-500 leading-relaxed text-sm">
                Publiez des offres, gérez vos candidatures et trouvez les meilleurs talents.
              </p>

              <ul className="mt-5 space-y-2 text-gray-600 text-sm">
                {[
                  "Publiez vos offres",
                  "Recherchez des candidats",
                  "Gérez les candidatures",
                  "Optimisez votre marque employeur",
                ].map((item, i) => (
                  <li key={i} className="flex items-center justify-center">
                    <span className="h-2 w-2 bg-purple-500 rounded-full mr-2"></span> {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center text-purple-600 font-medium group-hover:text-purple-700">
                S’inscrire comme recruteur
                <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-600 text-sm">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700 transition">
              Connectez-vous ici
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
