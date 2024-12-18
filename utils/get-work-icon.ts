import {
	BookOpenTextIcon,
	DramaIcon,
	FeatherIcon,
	FilesIcon,
	ImageIcon,
	NewspaperIcon,
	NotebookTabsIcon,
	RadioIcon,
	TextIcon,
} from "lucide-vue-next";

type Icon = typeof BookOpenTextIcon;

interface WorkType {
	icon: Icon;
	classification: string;
}

const workTypes: Record<string, WorkType> = {
	roman: { icon: BookOpenTextIcon, classification: "Primary" },
	erzählung: { icon: BookOpenTextIcon, classification: "Primary" },
	literarischerText: { icon: BookOpenTextIcon, classification: "Primary" },
	poetikvorlesung: { icon: BookOpenTextIcon, classification: "Primary" },
	kinderundjugendbuch: { icon: BookOpenTextIcon, classification: "Primary" },
	rede: { icon: BookOpenTextIcon, classification: "Primary" },
	essay: { icon: BookOpenTextIcon, classification: "Primary" },
	vorlesung: { icon: BookOpenTextIcon, classification: "Primary" },
	rezension: { icon: BookOpenTextIcon, classification: "Primary" },
	lyrik: { icon: FeatherIcon, classification: "Primary" },
	drama: { icon: DramaIcon, classification: "Primary" },
	hörspieldrehbuch: { icon: DramaIcon, classification: "Primary" },
	filmdrehbuchfilmvorlage: { icon: DramaIcon, classification: "Primary" },
	hörspiel: { icon: RadioIcon, classification: "Primary" },
	film: { icon: RadioIcon, classification: "Primary" },
	kinderundjugendbuchproduktion: { icon: RadioIcon, classification: "Primary" },
	hörspielübersetzunghörspielbearbeitung: { icon: RadioIcon, classification: "Primary" },
	literatursendung: { icon: RadioIcon, classification: "Primary" },
	anderweitigerbeitraginaudiovisuellenmedien: { icon: RadioIcon, classification: "Primary" },
	musik: { icon: RadioIcon, classification: "Tertiary" },
	paratext: { icon: TextIcon, classification: "Primary" },
	vorabdruck: { icon: TextIcon, classification: "Tertiary" },
	religiöserText: { icon: TextIcon, classification: "Tertiary" },
	abbildung: { icon: ImageIcon, classification: "Primary" },
	kunstwerk: { icon: ImageIcon, classification: "Tertiary" },
	monografie: { icon: NotebookTabsIcon, classification: "Secondary" },
	sammelband: { icon: NotebookTabsIcon, classification: "Secondary" },
	artikel: { icon: NotebookTabsIcon, classification: "Secondary" },
	journalartikel: { icon: NotebookTabsIcon, classification: "Secondary" },
	hochschulschrift: { icon: NotebookTabsIcon, classification: "Secondary" },
	diplomarbeit: { icon: NotebookTabsIcon, classification: "Secondary" },
	dissertation: { icon: NotebookTabsIcon, classification: "Secondary" },
	nachschlagewerk: { icon: NotebookTabsIcon, classification: "Tertiary" },
	besprechung: { icon: NewspaperIcon, classification: "Secondary" },
	bericht: { icon: NewspaperIcon, classification: "Secondary" },
	ankündigung: { icon: NewspaperIcon, classification: "Secondary" },
	porträt: { icon: NewspaperIcon, classification: "Secondary" },
	anderweitigejournalistischerezeption: { icon: NewspaperIcon, classification: "Secondary" },
	interview: { icon: NewspaperIcon, classification: "Tertiary" },
	korrespondenz: { icon: NewspaperIcon, classification: "Tertiary" },
	dramaopernaufführung: { icon: FilesIcon, classification: "Primary" },
	nachdichtungvonbarbarafrischmuth: { icon: FilesIcon, classification: "Secondary" },
	übersetzung: { icon: FilesIcon, classification: "Translation" },
	übersetzungvonwerkenandererautorinnen: { icon: FilesIcon, classification: "Translation" },
	übersetzungvonwerkenfrischmuths: { icon: FilesIcon, classification: "TranslationBF" },
};

export function getWorkIcon(workType: string): WorkType | null {
	const normalizedWorkType = workType
		.toLowerCase()
		.replace(/[-\s,]/g, "") // Removes dashes, spaces, and commas
		.replace(/[^a-zA-Zäöüß]/g, ""); // Removes any non-alphabet characters except for umlauts and ß
	return workTypes[normalizedWorkType] ?? null;
}
