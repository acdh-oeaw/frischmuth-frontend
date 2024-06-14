<script setup lang="ts">
const slider = { min: 1940, max: 2024 };
const sliderValue = ref([slider.min, slider.max]);
</script>

<template>
	<div class="text-lg font-medium text-frisch-orange">
		<div class="pb-4">
			<div class="pb-2 text-xl">Sortierung</div>
			<Separator class="bg-frisch-orange"></Separator>
		</div>
		<div class="pb-4">
			<div>Medium</div>
			<div class="grid grid-cols-2 py-3 text-sm font-normal">
				<div class="flex w-full flex-col">
					<div class="flex items-center">
						<Checkbox id="medium1" type="checkbox" />
						<label for="medium1" class="pl-2">Buch</label>
					</div>
					<div class="flex items-center">
						<Checkbox id="medium2" type="checkbox" />
						<label for="medium2" class="pl-2">Buchteil</label>
					</div>
					<div class="flex items-center">
						<Checkbox id="medium3" type="checkbox" />
						<label for="medium3" class="pl-2">Sekundärliteratur</label>
					</div>
				</div>
				<div class="flex w-full flex-col">
					<div class="flex items-center">
						<Checkbox id="medium4" type="checkbox" />
						<label for="medium4" class="pl-2">Hörspiel</label>
					</div>
					<div class="flex items-center">
						<Checkbox id="medium5" type="checkbox" />
						<label for="medium5" class="pl-2">Artikel</label>
					</div>
				</div>
			</div>
			<Separator class="bg-frisch-orange"></Separator>
		</div>
		<div class="pb-4">
			<div>Erscheinungsjahr</div>
			<div class="w-full py-3 text-sm font-normal">
				<div class="grid w-full grid-cols-[1fr_auto] pb-4">
					<div>{{ sliderValue[0] }}</div>
					<div>{{ sliderValue[1] }}</div>
				</div>
				<Slider v-model="sliderValue" class="pb-3" :max="slider.max" :min="slider.min" :step="1" />
			</div>
			<Separator class="bg-frisch-orange"></Separator>
		</div>
		<div class="pb-4">
			<div>Sprache</div>
			<div class="grid grid-cols-2 py-3 text-sm font-normal">
				<div class="flex w-full flex-col">
					<div class="flex items-center">
						<Checkbox id="language1" type="checkbox" />
						<label for="language1" class="pl-2">Deutsch</label>
					</div>
					<div class="flex items-center">
						<Checkbox id="language2" type="checkbox" />
						<label for="language2" class="pl-2">Englisch</label>
					</div>
					<div class="flex items-center">
						<Checkbox id="language3" type="checkbox" />
						<label for="language3" class="pl-2">Türkisch</label>
					</div>
				</div>
				<div class="flex w-full flex-col">
					<div class="flex items-center">
						<Checkbox id="language4" type="checkbox" />
						<label for="language4" class="pl-2">Ungarisch</label>
					</div>
					<div class="flex items-center">
						<Checkbox id="language5" type="checkbox" />
						<label for="language5" class="pl-2">Arabisch</label>
					</div>
				</div>
			</div>
			<Separator class="bg-frisch-orange"></Separator>
		</div>
		<div>
			<div>Thema</div>
			<div class="grid grid-cols-2 py-3 text-sm font-normal">
				<div class="flex w-full flex-col">
					<div class="flex items-center">
						<Checkbox id="theme1" type="checkbox" />
						<label for="theme1" class="pl-2">Familie</label>
					</div>
					<div class="flex items-center">
						<Checkbox id="theme2" type="checkbox" />
						<label for="theme2" class="pl-2">Beziehung</label>
					</div>
					<div class="flex items-center">
						<Checkbox id="theme3" type="checkbox" />
						<label for="theme3" class="pl-2">Karriere</label>
					</div>
				</div>
				<div class="flex w-full flex-col">
					<div class="flex items-center">
						<Checkbox id="theme4" type="checkbox" />
						<label for="theme4" class="pl-2">Selbstermächtigung</label>
					</div>
					<div class="flex items-center">
						<Checkbox id="theme5" type="checkbox" />
						<label for="theme5" class="pl-2">Künstler*innenleben</label>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
