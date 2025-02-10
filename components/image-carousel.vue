<script lang="ts" setup>
import type { CarouselApi } from "@/components/ui/carousel";

const props = defineProps<{
	images: Array<{
		title?: string;
		copyright?: string;
		alt?: string;
		image: string;
	}>;
}>();

const api = ref<CarouselApi>();
const current = ref(0);

const show = ref(false);

function setApi(val: CarouselApi) {
	api.value = val;
	if (api.value != null) {
		api.value.scrollTo(current.value, true);
	}
}

watch(api, (api) => {
	if (!api) return;

	current.value = api.selectedScrollSnap();

	api.on("select", () => {
		current.value = api.selectedScrollSnap();
	});
});
</script>

<template>
	<div class="relative">
		<Carousel v-if="!show" @init-api="setApi">
			<CarouselPrevious v-if="props.images.length > 1" class="z-20 ml-14 opacity-90" />
			<CarouselContent>
				<CarouselItem v-for="(image, index) of props.images" :key="index" class="h-full">
					<Card>
						<figure class="grid h-96 grid-rows-[1fr_auto] overflow-hidden">
							<div class="relative">
								<img
									:alt="image.alt ?? image.title"
									class="absolute size-full object-contain"
									:src="image.image"
								/>
							</div>
							<figcaption v-if="image.copyright" class="justify-self-center pb-1 text-sm">
								© {{ image.copyright }}
							</figcaption>
						</figure>
					</Card>
				</CarouselItem>
			</CarouselContent>
			<CarouselNext v-if="props.images.length > 1" class="z-20 mr-14 opacity-90" />
		</Carousel>
	</div>
</template>
