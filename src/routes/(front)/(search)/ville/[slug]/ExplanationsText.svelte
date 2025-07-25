<script>
	import { page } from '$app/stores';
	import Emoji from '$lib/components/Emoji.svelte';
	import MiniatureCollectivite from '$lib/components/MiniatureCollectivite.svelte';

	$: infos = $page.data.infos;

	$: enumeration = [
		'l’État',
		infos?.region?.titre,
		infos?.département?.titre,
		infos?.epci?.titre,
		infos?.ville?.titre,
	]
		.filter(Boolean)
		.reduce((concatenation, item, index, list) => {
			const separator = index === 0 ? '' : index === list.length - 1 ? ' et ' : ', ';
			return concatenation + separator + item;
		}, '');

	const determinant = (nom) => (nom.match(/^[aeiouy]/i) ? 'd’' : 'de ');
	$: deVille = determinant($page.data.ville.nom) + $page.data.ville.nom;
</script>

<div class="prose mt-12 max-w-full">
	{#if infos.pays}
		{@html infos.pays.text}
	{:else}
		<h1>Les aides à l’achat de vélo à {$page.data.ville.nom}</h1>

		{#if !infos.onlyNationalAides}
			<p>
				Acheter un nouveau vélo peut être un investissement important. Heureusement, vous pouvez
				peut-être bénéficier d'<strong
					>aides financières pour l'achat d'un vélo à {$page.data.ville.nom}</strong
				>. En effet {enumeration} cherchent à encourager l'usage du vélo car c'est un moyen de transport
				écologique et bon pour la santé.
			</p>

			<p>Le montant des aides dépend de plusieurs critères, en particulier :</p>
			<ul>
				<li>le type de vélo acheté</li>
				<li>le prix du vélo</li>
				<li>les revenus de votre foyer</li>
			</ul>
			<p>
				Pour vous aider à y voir plus clair, nous proposons un calculateur d'aide simple et gratuit.
				Le tableau ci-dessus indique le montant maximum auquel vous pouvez prétendre pour l'achat de
				chaque type de vélo. Cliquez sur une catégorie pour accéder au calculateur détaillé et
				personnalisez le résultat en quelques clics.
			</p>

			{#each ['epci', 'ville', 'region', 'département'] as collectivite}
				{#if infos[collectivite]}
					<h2>
						Les aides {#if collectivite === 'département'}du{:else}de{/if}
						{infos[collectivite].titre.replace(/^le/, '')}
					</h2>
					<MiniatureCollectivite {...infos[collectivite]} />
					{@html infos[collectivite].text}
				{/if}
			{/each}
		{:else}
			<p>
				Malheureusement <strong>il n’existe aucune aide locale</strong> à l’achat de vélo dans la
				ville de {$page.data.ville.nom}. En effet ni la ville, ni le département, ni la région ne
				proposent d’aide.
			</p>
			<p>
				Si vous y êtes éligible vous pourrez toutefois bénéficier de l’aide nationale accordée par
				l’État : <strong>le bonus écologique</strong>.
			</p>
			<p>
				Le tableau ci-dessus indique le montant maximal de l’aide de l’État pour chaque type de
				vélo. Cliquez sur une catégorie pour accéder au calculateur détaillé et personnalisez le
				résultat en quelques clics, en fonction de vos revenus et du prix du vélo.
			</p>
		{/if}

		<h2>Le bonus écologique de l’État</h2>
		<div
			class="flex items-start bg-red-50 border border-red-100 p-4 mt-2 rounded gap-4"
			role="alert"
		>
			<span class="bg-white border border-red-100 px-2 py-1 w-min rounded-lg">
				<Emoji className="ml-0" emoji="❌" />
			</span>
			<span>
				La prime à la conversion pour un vélo à assistance électrique (VAE) est
				<a
					href="https://www.service-public.fr/particuliers/vosdroits/F36828"
					target="_blank"
					class="text-green-600 hover:underline">supprimée depuis le 14 février 2025</a
				>.
			</span>
		</div>

		<!-- <p> -->
		<!-- 	Pour bénéficier du bonus écologique de l’État vous devez remplir les conditions suivantes : -->
		<!-- </p> -->
		<!-- <ul> -->
		<!-- 	<li>Être majeur et domicilié en France</li> -->
		<!-- 	<li> -->
		<!-- 		Avoir un revenu fiscal de référence par part l'année précédant l'achat du vélo inférieur ou -->
		<!-- 		égal à 15 400 € -->
		<!-- 	</li> -->
		<!-- </ul> -->
		<!-- <p> -->
		<!-- 	L’aide est de <strong>40% du prix du vélo</strong>, et elle est plafonnée en fonction du type -->
		<!-- 	de vélo. Par ailleurs les ménages les plus modestes bénéficient de plafonds plus élevés ainsi -->
		<!-- 	que d’une aide spécifique pour les vélos mécaniques non électriques. -->
		<!-- </p> -->
		<!---->
		<!-- <table> -->
		<!-- 	<thead> -->
		<!-- 		<tr> -->
		<!-- 			<th rowspan="2">Type de vélo</th> -->
		<!-- 			<th colspan="2" class="text-center">Plafond de l'aide</th> -->
		<!-- 		</tr> -->
		<!-- 		<tr> -->
		<!-- 			<th>Revenu inférieur à 7&nbsp;100&nbsp;€/an ou personne en situation de handicap</th> -->
		<!-- 			<th>Revenu inférieur à 15&nbsp;400&nbsp;€/an</th> -->
		<!-- 		</tr> -->
		<!-- 	</thead> -->
		<!-- 	<tbody> -->
		<!-- 		<tr> -->
		<!-- 			<td>Mécanique simple</td> -->
		<!-- 			<td>150 €</td> -->
		<!-- 			<td>0 €</td> -->
		<!-- 		</tr> -->
		<!-- 		<tr> -->
		<!-- 			<td>Vélo électrique</td> -->
		<!-- 			<td>400 €</td> -->
		<!-- 			<td>300 €</td> -->
		<!-- 		</tr> -->
		<!-- 		<tr> -->
		<!-- 			<td>Vélo cargo (avec assistance électrique ou non)</td> -->
		<!-- 			<td>2 000 €</td> -->
		<!-- 			<td>1 000 €</td> -->
		<!-- 		</tr> -->
		<!-- 		<tr> -->
		<!-- 			<td>Vélo pliant (avec assistance électrique ou non)</td> -->
		<!-- 			<td>2 000 €</td> -->
		<!-- 			<td>1 000 €</td> -->
		<!-- 		</tr> -->
		<!-- 		<tr> -->
		<!-- 			<td>Vélo adapté (avec assistance électrique ou non)</td> -->
		<!-- 			<td>2 000 €</td> -->
		<!-- 			<td>1 000 €</td> -->
		<!-- 		</tr> -->
		<!-- 	</tbody> -->
		<!-- </table> -->
		<!-- <p> -->
		<!-- 	La demande se fait en ligne au plus tard dans les <strong -->
		<!-- 		>6 mois suivant l’achat du vélo</strong -->
		<!-- 	>. -->
		<!-- </p> -->
		<!---->
		<!-- <p> -->
		<!-- 	En plus du bonus écologique, l’État propose aussi la <a href="/prime-a-la-conversion" -->
		<!-- 		>prime à la conversion</a -->
		<!-- 	> qui est une aide supplémentaire accordée en cas de remise à la case d’une vielle voiture essence -->
		<!-- 	ou diesel. -->
		<!-- </p> -->
		<!---->
		<!-- <h2>Quelles sont les pièces justificatives à fournir ?</h2> -->
		<!-- <p> -->
		<!-- 	Les documents demandés peuvent varier selon le type de vélo et l’organisme qui accorde l’aide. -->
		<!-- 	Dans la majorité des cas vous aurez besoin de -->
		<!-- </p> -->
		<!-- <ul> -->
		<!-- 	<li> -->
		<!-- 		copie de la facture d'achat acquittée avec le nom, le prénom et l'adresse du bénéficiaire et -->
		<!-- 		la mention du type de vélo acheté -->
		<!-- 	</li> -->
		<!-- 	<li>un justificatif de domicile récent</li> -->
		<!-- 	<li> -->
		<!-- 		un justificatif de revenu (dernier avis d’imposition) si l’aide est sous conditions de -->
		<!-- 		ressources -->
		<!-- 	</li> -->
		<!-- 	<li>un RIB pour reçevoir l’argent</li> -->
		<!-- 	<li>pour les vélos à assiance électrique : la copie du certificat d’homologation du vélo</li> -->
		<!-- </ul> -->
	{/if}

	<!-- {#if $page.data.ville.zfe} -->
	<!-- 	<h2>{$page.data.ville.nom} est une zone à faibles émissions mobilité (ZFE)</h2> -->
	<!-- 	<img -->
	<!-- 		src="/images/panneau-zfe.webp" -->
	<!-- 		alt="Signalisation d'une zone ZFE avec les vignettes Crit'Air" -->
	<!-- 		class="float-left pt-3 mr-6 !mb-6 max-h-[160px] w-[100px] object-contain" -->
	<!-- 	/> -->
	<!-- 	<p> -->
	<!-- 		Instaurée dans le cadre de la loi Climat d'août 2021, la mise en place des Zones à faibles -->
	<!-- 		émissions mobilité est obligatoire avant le 31 décembre 2024 pour toutes les agglomérations de -->
	<!-- 		plus de 150 000 habitants. Mais les villes qui le souhaitent peuvent mettre en place le mesure -->
	<!-- 		avant, ce qui est le cas à {$page.data.ville.nom}. -->
	<!-- 	</p> -->
	<!-- 	<p> -->
	<!-- 		Dans les ZFE les véhicules les plus polluants identifiés par les vignettes Crit'Air 5, 4 et 3 -->
	<!-- 		sont soumis à des restrictions de circulation. Ces restrictions peuvent s'appliquer sur des -->
	<!-- 		plages horaires déterminées. Les collectivités territoriales sont libres de fixer des règles -->
	<!-- 		plus strictes. -->
	<!-- 	</p> -->
	<!-- 	<p> -->
	<!-- 		S’agissant des aides à l’achat de vélo, la mise en place d'une ZFE s'accompagne d'un -->
	<!-- 		supplément à la <a href="/prime-a-la-conversion">prime à la conversion</a> lors de l'achat d’un -->
	<!-- 		vélo électrique si, dans le même temps, vous mettez à la casse un ancien véhicule diesel ou essence. -->
	<!-- 		Le montant de la surprime est identique à l'aide versée par la collectivité territoriale, dans -->
	<!-- 		la limite de 1 000 €. -->
	<!-- 	</p> -->
	<!-- {/if} -->

	{#if infos.labelTourDeFrance}
		<h2>{$page.data.ville.nom} labellisé par le Tour-de-France</h2>
		<img
			src="/images/ville-a-velo/{infos.labelTourDeFrance.note}.jpeg"
			alt="Label ville à vélo du Tour de France"
			class="float-left pt-4 mr-6 !mb-6 max-h-[120px] w-[200px] object-contain"
		/>
		<p>
			Le label « Ville à Vélo du Tour de France » consacre les collectivités engagées en faveur de
			la mobilité à vélo. Lancé en 2021 et ouvert à toutes les collectivités ayant accueilli au
			moins une fois le Tour de France, il a pour but d’encourager les initiatives prises par les
			communes en faveur de la bicyclette au quotidien.
		</p>

		<p>Le label est décliné selon quatre niveaux symbolisés par de petits vélos.</p>

		<p class="font-bold">
			La ville {deVille} a reçu la labellisation « {infos.labelTourDeFrance.note} vélo{#if infos.labelTourDeFrance.note > 1}s{/if}
			»{#if infos.labelTourDeFrance.note === 4}, la meilleure note possible{/if}
			{#if infos.labelTourDeFrance.commentaire}{' '}
				avec le commentaire du jury :{:else}.{/if}
		</p>
		{#if infos.labelTourDeFrance.commentaire}
			<blockquote>
				{infos.labelTourDeFrance.commentaire}
			</blockquote>
		{/if}
	{/if}

	{#if infos.barometreFub}
		<h2>
			Une ville «&nbsp;{infos.barometreFub.label}&nbsp;» au vélo d’après le baromètre de la FUB
		</h2>

		<p>
			La Fédération des Usagers de la Bicyclette (FUB) réalise chaque année une enquête auprès des
			cyclistes et non cyclistes pour mesurer leur ressenti sur l’usage du vélo en ville.
		</p>
		<div class="flex justify-center my-8">
			<div class="classement-fub flex shadow shadow-md">
				{#each [['#e44b23', 'G'], ['#f39939', 'F'], ['#fccb2d', 'E'], ['#ffee31', 'D'], ['#c8d228', 'C'], ['#79b52e', 'B'], ['#4b9833', 'A'], ['#00822C', 'A+']] as [background, label]}
					<span style:background class:active={label === infos.barometreFub.note}>{label}</span>
				{/each}
			</div>
		</div>
		<p>
			En 2021 la ville {deVille} a reçu la note de
			<strong class="inline-block border px-2 rounded shadow">{infos.barometreFub.note}</strong>
			sur une échelle allant de <strong class="inline-block border px-2 rounded shadow">G</strong>
			pour la plus défavorable à
			<strong class="inline-block border px-2 rounded shadow">A+</strong> pour la plus favorable.
			Vous pouvez consultez le détail des notes sur le
			<a href="https://barometre.parlons-velo.fr/2021/palmares/">site du baromètre</a>.
		</p>
		{#if infos.classementVillePlus}
			<p>
				<a href="https://villes.plus/cyclables/{infos.classementVillePlus.typeClassement}"
					><img
						src="/images/logo-villesplus.svg"
						class="w-20 h-20 !my-2 mr-4 float-left"
						alt="logo villes.plus"
					/></a
				>
				Par ailleurs {infos.classementVillePlus.territoireClasse} se classe {infos
					.classementVillePlus.position}<sup
					>{infos.classementVillePlus.position === 1 ? 'ère' : 'ème'}</sup
				>/{infos.classementVillePlus.total} au
				<a href="https://villes.plus/cyclables/{infos.classementVillePlus.typeClassement}"
					>classement de {infos.classementVillePlus.dateClassement} des {infos.classementVillePlus
						.nomClassement} cyclables du site villes.plus</a
				>. Ce classement mesure la part de pistes cyclables sécurisées pour se déplacer dans {infos
					.classementVillePlus.leTerritoire}.
			</p>
		{/if}
	{/if}
</div>

<style>
	.classement-fub span {
		height: 40px;
		width: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
		font-family: sans-serif;
		@apply first:rounded-l last:rounded-r;
	}

	.classement-fub span.active {
		transform: scale(1.3);
		z-index: 10;
		@apply rounded shadow shadow-md;
	}
</style>
