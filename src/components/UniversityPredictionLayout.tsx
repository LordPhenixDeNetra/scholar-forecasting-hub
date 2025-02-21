import { useState, ReactNode } from "react";
import { StudentForm } from "@/components/StudentForm";
import type { StudentInput } from "@/types/student";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Menu,
    ChevronDown,
    School,
    GraduationCap,
    MenuIcon,
    Building2,
    BookOpen
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface University {
    id: string;
    name: string;
    faculties: Faculty[];
}

interface Faculty {
    id: string;
    name: string;
    departments: Department[];
}

interface Department {
    id: string;
    name: string;
}

interface UniversityPredictionLayoutProps {
    onSubmitWithPrediction: (data: StudentInput) => Promise<void>;
    headerContent?: ReactNode;
    children?: ReactNode;
}

const universities: University[] = [
    {
        id: "ucad",
        name: "Université Cheikh Anta Diop (UCAD)",
        faculties: [
            {
                id: "fst",
                name: "Faculté des Sciences et Techniques",
                departments: [
                    { id: "mpi", name: "Mathématiques Physique Informatique (MPI)" },
                    { id: "pcsm", name: "Physique Chimie Science de la Matière (PCSM)" },
                    { id: "sn", name: "Biologie Chimie Geo-Science (BCGS)" },
                ],
            },
            {
                id: "fsjp",
                name: "Faculté des Sciences Juridiques et Politiques",
                departments: [
                    { id: "droit", name: "Droit" },
                    { id: "sciences-po", name: "Sciences Politiques" },
                ],
            },
            {
                id: "fseg",
                name: "Faculté des Sciences Économiques et de Gestion",
                departments: [
                    { id: "eco", name: "Économie" },
                    { id: "gestion", name: "Gestion" },
                ],
            },
            {
                id: "fmpo",
                name: "Faculté de Médecine, Pharmacie et Odontologie",
                departments: [
                    { id: "medecine", name: "Médecine" },
                    { id: "pharmacie", name: "Pharmacie" },
                    { id: "odontologie", name: "Odontologie" },
                ],
            },
            {
                id: "flsh",
                name: "Faculté des Lettres et Sciences Humaines",
                departments: [
                    { id: "lettres", name: "Lettres Modernes" },
                    { id: "philosophie", name: "Philosophie" },
                    { id: "histoire", name: "Histoire" },
                ],
            },
            {
                id: "fastef",
                name: "Faculté des Sciences et Technologies de l’Éducation et de la Formation",
                departments: [
                    { id: "sciences-education", name: "Sciences de l’Éducation" },
                    { id: "formation", name: "Formation des Enseignants" },
                ],
            },
        ],
    },
    {
        id: "uam",
        name: "Université Amadou Mahtar Mbow (UAM)",
        faculties: [
            {
                id: "set",
                name: "Faculté des Sciences, de l'Ingénierie et des Technologies",
                departments: [
                    { id: "info", name: "Informatique" },
                    { id: "genie-civil", name: "Génie Civil" },
                    { id: "genie-electrique", name: "Génie Électrique" },
                ],
            },
            {
                id: "shs",
                name: "Faculté des Sciences Humaines et Sociales",
                departments: [
                    { id: "sciences-education", name: "Sciences de l’Éducation" },
                    { id: "lettres", name: "Lettres" },
                    { id: "histoire", name: "Histoire" },
                ],
            },
        ],
    },
    {
        id: "ugb",
        name: "Université Gaston Berger (UGB)",
        faculties: [
            {
                id: "sat",
                name: "Faculté des Sciences Appliquées et de Technologie",
                departments: [
                    { id: "info", name: "Informatique" },
                    { id: "maths", name: "Mathématiques" },
                    { id: "physique", name: "Physique" },
                ],
            },
            {
                id: "ses",
                name: "Faculté des Sciences Économiques et de Gestion",
                departments: [
                    { id: "eco", name: "Économie" },
                    { id: "gestion", name: "Gestion" },
                ],
            },
            {
                id: "lsh",
                name: "Faculté des Lettres et Sciences Humaines",
                departments: [
                    { id: "lettres", name: "Lettres Modernes" },
                    { id: "philosophie", name: "Philosophie" },
                    { id: "histoire", name: "Histoire" },
                ],
            },
            {
                id: "sante",
                name: "Faculté des Sciences de la Santé",
                departments: [
                    { id: "medecine", name: "Médecine" },
                    { id: "pharmacie", name: "Pharmacie" },
                    { id: "odontologie", name: "Odontologie" },
                ],
            },
        ],
    },
    {
        id: "uadb",
        name: "Université Alioune Diop de Bambey (UADB)",
        faculties: [
            {
                id: "sat",
                name: "Faculté des Sciences Appliquées et de Technologie",
                departments: [
                    { id: "genie-rural", name: "Génie Rural" },
                    { id: "agroalimentaire", name: "Agroalimentaire" },
                ],
            },
            {
                id: "sje",
                name: "Faculté des Sciences Juridiques et Économiques",
                departments: [
                    { id: "droit", name: "Droit" },
                    { id: "eco", name: "Économie" },
                ],
            },
        ],
    },
    {
        id: "uasz",
        name: "Université Assane Seck de Ziguinchor (UASZ)",
        faculties: [
            {
                id: "sst",
                name: "Faculté des Sciences et Technologies",
                departments: [
                    { id: "info", name: "Informatique" },
                    { id: "maths", name: "Mathématiques" },
                    { id: "physique", name: "Physique" },
                ],
            },
            {
                id: "shs",
                name: "Faculté des Sciences Humaines et Sociales",
                departments: [
                    { id: "histoire", name: "Histoire" },
                    { id: "sociologie", name: "Sociologie" },
                ],
            },
        ],
    },

];



export function UniversityPredictionLayout({
                                               onSubmitWithPrediction,
                                               headerContent,
                                               children
                                           }: UniversityPredictionLayoutProps) {
    const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
    const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const handleSelectionChange = (uni: string, fac: string, dept: string) => {
        setSelectedUniversity(uni);
        setSelectedFaculty(fac);
        setSelectedDepartment(dept);
        setIsMobileOpen(false);
        setIsFormSubmitted(false); // Réinitialiser le formulaire lors du changement de filière
    };

    const handleFormSubmit = async (data: StudentInput) => {
        try {
            await onSubmitWithPrediction(data);
            setIsFormSubmitted(true);
        } catch (error) {
            console.error("Erreur lors de la soumission:", error);
        }
    };

    const handleReset = () => {
        setIsFormSubmitted(false);
    };

    // const renderSidebar = () => (
    //     <div className="h-screen flex flex-col">
    //         {/* En-tête du sidebar */}
    //         <div className="p-6 border-b bg-white">
    //             <div className="flex items-center gap-3">
    //                 <School className="w-6 h-6 text-primary" />
    //                 <h2 className="text-xl font-semibold text-gray-900">
    //                     DIORES
    //                 </h2>
    //             </div>
    //             <p className="mt-2 text-sm text-gray-500">
    //                 Sélectionnez une filière
    //             </p>
    //         </div>
    //
    //         {/* Contenu scrollable */}
    //         <ScrollArea className="flex-1 px-3 py-4">
    //             <Accordion
    //                 type="single"
    //                 collapsible
    //                 className="space-y-2"
    //             >
    //                 {universities.map((university) => (
    //                     <AccordionItem
    //                         key={university.id}
    //                         value={university.id}
    //                         className="border rounded-lg bg-white shadow-sm"
    //                     >
    //                         <AccordionTrigger className="px-4 py-3 hover:no-underline group">
    //                             <div className="flex items-center gap-3">
    //                                 <Building2 className="w-5 h-5 text-primary/80 group-hover:text-primary" />
    //                                 <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
    //                 {university.name}
    //               </span>
    //                             </div>
    //                         </AccordionTrigger>
    //                         <AccordionContent className="px-4 pb-3 pt-1">
    //                             <Accordion type="single" collapsible className="space-y-2">
    //                                 {university.faculties.map((faculty) => (
    //                                     <AccordionItem
    //                                         key={faculty.id}
    //                                         value={faculty.id}
    //                                         className="border border-gray-100 rounded-md overflow-hidden"
    //                                     >
    //                                         <AccordionTrigger className="px-3 py-2 hover:no-underline group">
    //                                             <div className="flex items-center gap-2">
    //                                                 <BookOpen className="w-4 h-4 text-primary/70 group-hover:text-primary" />
    //                                                 <span className="text-sm text-gray-600 group-hover:text-gray-900">
    //                         {faculty.name}
    //                       </span>
    //                                             </div>
    //                                         </AccordionTrigger>
    //                                         <AccordionContent className="px-2 pb-2">
    //                                             <div className="space-y-1 mt-1">
    //                                                 {faculty.departments.map((department) => (
    //                                                     <Button
    //                                                         key={department.id}
    //                                                         variant={selectedDepartment === department.id ? "default" : "ghost"}
    //                                                         className={`w-full justify-start text-sm py-2 px-3 rounded-md ${
    //                                                             selectedDepartment === department.id
    //                                                                 ? "bg-primary/10 text-primary hover:bg-primary/15"
    //                                                                 : "hover:bg-gray-100"
    //                                                         }`}
    //                                                         onClick={() => handleSelectionChange(
    //                                                             university.id,
    //                                                             faculty.id,
    //                                                             department.id
    //                                                         )}
    //                                                     >
    //                                                         <GraduationCap className={`w-4 h-4 mr-2 ${
    //                                                             selectedDepartment === department.id
    //                                                                 ? "text-primary"
    //                                                                 : "text-gray-500"
    //                                                         }`} />
    //                                                         <span className="text-left line-clamp-2">
    //                             {department.name}
    //                           </span>
    //                                                     </Button>
    //                                                 ))}
    //                                             </div>
    //                                         </AccordionContent>
    //                                     </AccordionItem>
    //                                 ))}
    //                             </Accordion>
    //                         </AccordionContent>
    //                     </AccordionItem>
    //                 ))}
    //             </Accordion>
    //         </ScrollArea>
    //     </div>
    // );

    const renderSidebar = () => (
        <div className="h-screen flex flex-col">
            {/* En-tête du sidebar */}
            <div className="p-6 border-b bg-white">
                <div className="flex items-center gap-3">
                    <School className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold text-gray-900">
                        DIORES
                    </h2>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                    Sélectionnez une filière
                </p>
            </div>

            {/* Contenu scrollable */}
            <ScrollArea className="flex-1 px-3 py-4">
                <Accordion type="single" collapsible className="space-y-2">
                    {universities.map((university) => (
                        <AccordionItem
                            key={university.id}
                            value={university.id}
                            className={`border rounded-lg bg-white shadow-sm transition-all duration-300 ${
                                university.id === "ucad"
                                    ? "hover:shadow-md hover:border-primary/20 hover:scale-[1.01]"
                                    : "opacity-50"
                            }`}
                            title={university.id !== "ucad" ? "Indisponible" : ""}
                            style={university.id !== "ucad" ? { cursor: "not-allowed" } : undefined}
                        >
                            <AccordionTrigger
                                className={`px-4 py-3 hover:no-underline group ${
                                    university.id === "ucad"
                                        ? "transition-colors duration-300 hover:bg-primary/5"
                                        : ""
                                }`}
                                disabled={university.id !== "ucad"}
                            >
                                <div className="flex items-center gap-3">
                                    <Building2 className={`w-5 h-5 transition-all duration-300 ${
                                        university.id === "ucad"
                                            ? "text-primary/80 group-hover:text-primary group-hover:scale-110"
                                            : "text-gray-400"
                                    }`} />
                                    <span className={`text-sm font-medium transition-colors duration-300 ${
                                        university.id === "ucad"
                                            ? "text-gray-700 group-hover:text-primary"
                                            : "text-gray-400"
                                    }`}>
                                   {university.name}
                                        {university.id !== "ucad" && (
                                            <span className="ml-2 text-xs text-gray-400">
                                           (Bientôt disponible)
                                       </span>
                                        )}
                               </span>
                                </div>
                            </AccordionTrigger>

                            {university.id === "ucad" && (
                                <AccordionContent className="px-4 pb-3 pt-1">
                                    <Accordion type="single" collapsible className="space-y-2">
                                        {university.faculties.map((faculty) => (
                                            <AccordionItem
                                                key={faculty.id}
                                                value={faculty.id}
                                                className={`border border-gray-100 rounded-md overflow-hidden transition-all duration-300 ${
                                                    faculty.id === "fst"
                                                        ? "hover:border-primary/20 hover:bg-primary/5"
                                                        : "opacity-50"
                                                }`}
                                                title={faculty.id !== "fst" ? "Indisponible" : ""}
                                                style={faculty.id !== "fst" ? { cursor: "not-allowed" } : undefined}
                                            >
                                                <AccordionTrigger
                                                    className={`px-3 py-2 hover:no-underline group ${
                                                        faculty.id === "fst"
                                                            ? "transition-all duration-300"
                                                            : ""
                                                    }`}
                                                    disabled={faculty.id !== "fst"}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className={`w-4 h-4 transition-transform duration-300 ${
                                                            faculty.id === "fst"
                                                                ? "text-primary/70 group-hover:text-primary group-hover:rotate-6"
                                                                : "text-gray-400"
                                                        }`} />
                                                        <span className={`text-sm transition-colors duration-300 ${
                                                            faculty.id === "fst"
                                                                ? "text-gray-600 group-hover:text-primary"
                                                                : "text-gray-400"
                                                        }`}>
                                                       {faculty.name}
                                                            {faculty.id !== "fst" && (
                                                                <span className="ml-2 text-xs text-gray-400">
                                                               (Bientôt disponible)
                                                           </span>
                                                            )}
                                                   </span>
                                                    </div>
                                                </AccordionTrigger>

                                                {faculty.id === "fst" && (
                                                    <AccordionContent className="px-2 pb-2">
                                                        <div className="space-y-1 mt-1">
                                                            {faculty.departments.map((department) => (
                                                                <Button
                                                                    key={department.id}
                                                                    variant={selectedDepartment === department.id ? "default" : "ghost"}
                                                                    className={`w-full justify-start text-sm py-2 px-3 rounded-md transition-all duration-300 ${
                                                                        selectedDepartment === department.id
                                                                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                                                                            : "hover:bg-primary/5 hover:translate-x-1"
                                                                    }`}
                                                                    onClick={() => handleSelectionChange(
                                                                        university.id,
                                                                        faculty.id,
                                                                        department.id
                                                                    )}
                                                                >
                                                                    <GraduationCap className={`w-4 h-4 mr-2 transition-all duration-300 ${
                                                                        selectedDepartment === department.id
                                                                            ? "text-primary transform rotate-12"
                                                                            : "text-gray-500 group-hover:text-primary group-hover:scale-110"
                                                                    }`} />
                                                                    <span className="text-left line-clamp-2 transition-colors duration-300">
                                                                   {department.name}
                                                               </span>
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </AccordionContent>
                                                )}
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </AccordionContent>
                            )}
                        </AccordionItem>
                    ))}
                </Accordion>
            </ScrollArea>
        </div>
    );

    const renderBreadcrumbs = () => {
        if (!selectedUniversity) return null;

        const university = universities.find(u => u.id === selectedUniversity);
        if (!university) return null;

        const faculty = university.faculties.find(f => f.id === selectedFaculty);
        if (!faculty) return null;

        const department = faculty.departments.find(d => d.id === selectedDepartment);
        if (!department) return null;

        return (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <School className="w-4 h-4" />
                <span>{university.name}</span>
                <ChevronDown className="w-4 h-4" />
                <span>{faculty.name}</span>
                <ChevronDown className="w-4 h-4" />
                <span>{department.name}</span>
            </div>
        );
    };


    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar pour desktop */}
            <div className="hidden md:block w-80 border-r bg-gray-50 shadow-lg transition-all duration-300 ease-in-out">
                {renderSidebar()}
            </div>

            {/* Menu hamburger et sidebar pour mobile */}
            <div className="md:hidden">
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            className="fixed top-4 left-4 p-2 bg-white shadow-md hover:bg-gray-50"
                        >
                            <MenuIcon className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0 bg-gray-50">
                        {renderSidebar()}
                    </SheetContent>
                </Sheet>
            </div>

            {/* Contenu principal */}
            <main className="flex-1 overflow-auto bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {headerContent}

                    {selectedDepartment ? (
                        <div className="space-y-8">
                            {renderBreadcrumbs()}

                            {/*{!isFormSubmitted ? (*/}
                            {/*    <StudentForm onSubmit={handleFormSubmit} />*/}
                            {/*) : (*/}
                            {/*    <div className="space-y-6">*/}
                            {/*        {children}*/}
                            {/*        <Button*/}
                            {/*            onClick={handleReset}*/}
                            {/*            className="w-full sm:w-auto mt-4"*/}
                            {/*            variant="outline"*/}
                            {/*        >*/}
                            {/*            Faire une nouvelle prédiction*/}
                            {/*        </Button>*/}
                            {/*    </div>*/}
                            {/*)}*/}


                            {!isFormSubmitted ? (
                                <StudentForm onSubmit={handleFormSubmit} />
                            ) : (
                                <div className="space-y-6">
                                    {children}
                                    <div className="flex justify-center">
                                        <Button
                                            onClick={handleReset}
                                            className="transition-all duration-300 hover:scale-105 transform active:scale-95 bg-white text-primary hover:bg-primary hover:text-white border-2 border-primary px-8 py-2"
                                            variant="outline"
                                        >
                                            Faire une nouvelle prédiction
                                        </Button>
                                    </div>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-4">
                            <School className="w-16 h-16 text-primary/40" />
                            <h2 className="text-2xl font-semibold text-gray-700">
                                Sélectionnez une filière
                            </h2>
                            <p className="text-gray-500 max-w-md">
                                Choisissez une université et une filière dans le menu pour commencer
                                la prédiction de réussite.
                            </p>
                        </div>
                    )}
                </div>

                {/*Footer*/}
                <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Section À propos */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <School className="w-5 h-5 text-primary" />
                                    À propos de DIORES
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Un système intelligent de prédiction de la réussite des étudiants,
                                    développé pour accompagner les parcours académiques au Sénégal.
                                </p>
                            </div>

                            {/* Section Contact */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-primary" />
                                    Contact
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>Université Cheikh Anta Diop de Dakar</li>
                                    {/*<li>Faculté des Sciences et Techniques</li>*/}
                                    {/*<li>Département de Mathématiques et Informatique</li>*/}
                                </ul>
                            </div>

                            {/* Section Liens rapides */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                    Liens rapides
                                </h3>
                                <div className="grid grid-cols-1 gap-2">
                                    <Button
                                        variant="link"
                                        className="text-primary hover:text-primary/80 p-0 h-auto font-normal justify-start"
                                    >
                                        Guide d'utilisation
                                    </Button>
                                    <Button
                                        variant="link"
                                        className="text-primary hover:text-primary/80 p-0 h-auto font-normal justify-start"
                                    >
                                        Mentions légales
                                    </Button>
                                    <Button
                                        variant="link"
                                        className="text-primary hover:text-primary/80 p-0 h-auto font-normal justify-start"
                                    >
                                        Politique de confidentialité
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div>
                                <img src="/grantees.png" alt="Logo DIORES" className="w-88 h-14 mx-auto"/>
                            </div>
                            <p className="text-center text-sm text-gray-500 my-3">
                                © {new Date().getFullYear()} DIORES. Tous droits réservés.
                                <span className="block sm:inline sm:ml-1">
                                    Développé à l'UCAD.
                                </span>
                            </p>
                        </div>
                    </div>
                </footer>

            </main>
        </div>
    );
}









//
//
// import { useState, ReactNode } from "react";
// import { StudentForm } from "@/components/StudentForm";
// import type { StudentInput } from "@/types/student";
// import { Button } from "@/components/ui/button";
// import {
//     Sheet,
//     SheetContent,
//     SheetHeader,
//     SheetTitle,
//     SheetTrigger,
// } from "@/components/ui/sheet";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//     Menu,
//     ChevronDown,
//     School,
//     GraduationCap,
//     MenuIcon,
//     Building2,
//     BookOpen
// } from "lucide-react";
// import {
//     Accordion,
//     AccordionContent,
//     AccordionItem,
//     AccordionTrigger,
// } from "@/components/ui/accordion";
//
// interface University {
//     id: string;
//     name: string;
//     faculties: Faculty[];
// }
//
// interface Faculty {
//     id: string;
//     name: string;
//     departments: Department[];
// }
//
// interface Department {
//     id: string;
//     name: string;
// }
//
// interface UniversityPredictionLayoutProps {
//     onSubmitWithPrediction: (data: StudentInput) => Promise<void>;
//     headerContent?: ReactNode;
//     children?: ReactNode;
// }
//
// const universities: University[] = [
//     {
//         id: "ucad",
//         name: "Université Cheikh Anta Diop (UCAD)",
//         faculties: [
//             {
//                 id: "fst",
//                 name: "Faculté des Sciences et Technologies",
//                 departments: [
//                     { id: "mpi", name: "Mathématiques Physique Informatique (MPI)" },
//                     { id: "pc", name: "Physique Chimie Science de la Matiere (PCSM)" },
//                     { id: "sn", name: "Biologie Chimie Geo-Science (BCGS)" },
//                 ],
//             },
//             {
//                 id: "fsjp",
//                 name: "Faculté des Sciences Juridiques et Politiques",
//                 departments: [
//                     { id: "droit", name: "Droit" },
//                     { id: "sciences-po", name: "Sciences Politiques" },
//                 ],
//             },
//         ],
//     },
//     {
//         id: "uam",
//         name: "Université Amadou Mahtar Mbow (UAM)",
//         faculties: [
//             {
//                 id: "set",
//                 name: "Sciences, Engineering et Technologies",
//                 departments: [
//                     { id: "info", name: "Informatique" },
//                     { id: "genie-civil", name: "Génie Civil" },
//                 ],
//             },
//         ],
//     },
// ];
//
// export function UniversityPredictionLayout({
//                                                onSubmitWithPrediction,
//                                                headerContent,
//                                                children
//                                            }: UniversityPredictionLayoutProps) {
//     const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
//     const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
//     const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
//     const [isMobileOpen, setIsMobileOpen] = useState(false);
//
//     const handleSelectionChange = (uni: string, fac: string, dept: string) => {
//         setSelectedUniversity(uni);
//         setSelectedFaculty(fac);
//         setSelectedDepartment(dept);
//         setIsMobileOpen(false);
//     };
//
//
//     const renderBreadcrumbs = () => {
//         if (!selectedUniversity) return null;
//
//         const university = universities.find(u => u.id === selectedUniversity);
//         if (!university) return null;
//
//         const faculty = university.faculties.find(f => f.id === selectedFaculty);
//         if (!faculty) return null;
//
//         const department = faculty.departments.find(d => d.id === selectedDepartment);
//         if (!department) return null;
//
//         return (
//             <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
//                 <School className="w-4 h-4" />
//                 <span>{university.name}</span>
//                 <ChevronDown className="w-4 h-4" />
//                 <span>{faculty.name}</span>
//                 <ChevronDown className="w-4 h-4" />
//                 <span>{department.name}</span>
//             </div>
//         );
//     };
//
//     const renderSidebar = () => (
//         <div className="h-screen flex flex-col">
//             {/* En-tête du sidebar */}
//             <div className="p-6 border-b bg-white">
//                 <div className="flex items-center gap-3">
//                     <School className="w-6 h-6 text-primary" />
//                     <h2 className="text-xl font-semibold text-gray-900">
//                         DIORES
//                     </h2>
//                 </div>
//                 <p className="mt-2 text-sm text-gray-500">
//                     Sélectionnez votre parcours
//                 </p>
//             </div>
//
//             {/* Contenu scrollable */}
//             <ScrollArea className="flex-1 px-3 py-4">
//                 <Accordion
//                     type="single"
//                     collapsible
//                     className="space-y-2"
//                 >
//                     {universities.map((university) => (
//                         <AccordionItem
//                             key={university.id}
//                             value={university.id}
//                             className="border rounded-lg bg-white shadow-sm"
//                         >
//                             <AccordionTrigger className="px-4 py-3 hover:no-underline group">
//                                 <div className="flex items-center gap-3">
//                                     <Building2 className="w-5 h-5 text-primary/80 group-hover:text-primary" />
//                                     <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
//                     {university.name}
//                   </span>
//                                 </div>
//                             </AccordionTrigger>
//                             <AccordionContent className="px-4 pb-3 pt-1">
//                                 <Accordion type="single" collapsible className="space-y-2">
//                                     {university.faculties.map((faculty) => (
//                                         <AccordionItem
//                                             key={faculty.id}
//                                             value={faculty.id}
//                                             className="border border-gray-100 rounded-md overflow-hidden"
//                                         >
//                                             <AccordionTrigger className="px-3 py-2 hover:no-underline group">
//                                                 <div className="flex items-center gap-2">
//                                                     <BookOpen className="w-4 h-4 text-primary/70 group-hover:text-primary" />
//                                                     <span className="text-sm text-gray-600 group-hover:text-gray-900">
//                             {faculty.name}
//                           </span>
//                                                 </div>
//                                             </AccordionTrigger>
//                                             <AccordionContent className="px-2 pb-2">
//                                                 <div className="space-y-1 mt-1">
//                                                     {faculty.departments.map((department) => (
//                                                         <Button
//                                                             key={department.id}
//                                                             variant={selectedDepartment === department.id ? "default" : "ghost"}
//                                                             className={`w-full justify-start text-sm py-2 px-3 rounded-md ${
//                                                                 selectedDepartment === department.id
//                                                                     ? "bg-primary/10 text-primary hover:bg-primary/15"
//                                                                     : "hover:bg-gray-100"
//                                                             }`}
//                                                             onClick={() => handleSelectionChange(
//                                                                 university.id,
//                                                                 faculty.id,
//                                                                 department.id
//                                                             )}
//                                                         >
//                                                             <GraduationCap className={`w-4 h-4 mr-2 ${
//                                                                 selectedDepartment === department.id
//                                                                     ? "text-primary"
//                                                                     : "text-gray-500"
//                                                             }`} />
//                                                             <span className="text-left line-clamp-2">
//                                 {department.name}
//                               </span>
//                                                         </Button>
//                                                     ))}
//                                                 </div>
//                                             </AccordionContent>
//                                         </AccordionItem>
//                                     ))}
//                                 </Accordion>
//                             </AccordionContent>
//                         </AccordionItem>
//                     ))}
//                 </Accordion>
//             </ScrollArea>
//         </div>
//     );
//
//     return (
//         <div className="flex h-screen bg-gray-50">
//             {/* Sidebar pour desktop avec ombre et meilleure transition */}
//             <div className="hidden md:block w-80 border-r bg-gray-50 shadow-lg transition-all duration-300 ease-in-out">
//                 {renderSidebar()}
//             </div>
//
//             {/* Menu hamburger et sidebar pour mobile */}
//             <div className="md:hidden">
//                 <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
//                     <SheetTrigger asChild>
//                         <Button
//                             variant="ghost"
//                             className="fixed top-4 left-4 p-2 bg-white shadow-md hover:bg-gray-50"
//                         >
//                             <MenuIcon className="w-6 h-6" />
//                         </Button>
//                     </SheetTrigger>
//                     <SheetContent side="left" className="w-80 p-0 bg-gray-50">
//                         {renderSidebar()}
//                     </SheetContent>
//                 </Sheet>
//             </div>
//
//             {/* Contenu principal avec meilleur espacement */}
//             <main className="flex-1 overflow-auto bg-gray-50">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                     {headerContent}
//
//                     {selectedDepartment ? (
//                         <div className="space-y-8">
//                             {renderBreadcrumbs()}
//                             <StudentForm onSubmit={onSubmitWithPrediction} />
//                             {children}
//                         </div>
//                     ) : (
//                         <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-4">
//                             <School className="w-16 h-16 text-primary/40" />
//                             <h2 className="text-2xl font-semibold text-gray-700">
//                                 Sélectionnez une filière
//                             </h2>
//                             <p className="text-gray-500 max-w-md">
//                                 Choisissez une université et une filière dans le menu pour commencer
//                                 la prédiction de réussite.
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             </main>
//         </div>
//     );
// }