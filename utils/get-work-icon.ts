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

const icons: Record<string, Icon> = {
	roman: BookOpenTextIcon,
	erzählung: BookOpenTextIcon,
	literarischerText: BookOpenTextIcon,
	poetikvorlesung: BookOpenTextIcon,
	kinderundjugendbuch: BookOpenTextIcon,
	rede: BookOpenTextIcon,
	essay: BookOpenTextIcon,
	vorlesung: BookOpenTextIcon,
	rezension: BookOpenTextIcon,
	lyrik: FeatherIcon,
	drama: DramaIcon,
	hörspieldrehbuch: DramaIcon,
	filmdrehbuchfilmvorlage: DramaIcon,
	hörspiel: RadioIcon,
	film: RadioIcon,
	kinderundjugendbuchproduktion: RadioIcon,
	hörspielübersetzunghörspielbearbeitung: RadioIcon,
	literatursendung: RadioIcon,
	anderweitigerbeitraginaudiovisuellenmedien: RadioIcon,
	//next item is not in the hierachry:
	musik: RadioIcon,
	paratext: TextIcon,
	//next item is not in the hierachry:
	vorabdruck: TextIcon,
	//next item is not in the hierachry:
	religiöserText: TextIcon,
	abbildung: ImageIcon,
	//next item is not in the hierachry:
	kunstwerk: ImageIcon,
	monografie: NotebookTabsIcon,
	sammelband: NotebookTabsIcon,
	artikel: NotebookTabsIcon,
	journalartikel: NotebookTabsIcon,
	hochschulschrift: NotebookTabsIcon,
	diplomarbeit: NotebookTabsIcon,
	dissertation: NotebookTabsIcon,
	//next item is not in the hierachry:
	nachschlagewerk: NotebookTabsIcon,
	besprechung: NewspaperIcon,
	bericht: NewspaperIcon,
	ankündigung: NewspaperIcon,
	porträt: NewspaperIcon,
	anderweitigejournalistischerezeption: NewspaperIcon,
	//next item is not in the hierachry:
	interview: NewspaperIcon,
	//next item is not in the hierachry:
	korrespondenz: NewspaperIcon,
	dramaopernaufführung: FilesIcon,
	nachdichtungvonbarbarafrischmuth: FilesIcon,
};

export function getWorkIcon(workType: string): Icon | null {
	const normalizedWorkType = workType
		.toLowerCase()
		.replace(/[-\s,]/g, "") // Removes dashes, spaces, and commas
		.replace(/[^a-zA-Zäöüß]/g, ""); // Removes any non-alphabet characters except for umlauts and ß
	console.log(normalizedWorkType);
	return icons[normalizedWorkType] ?? null;
}
