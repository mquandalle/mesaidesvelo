<script>
	import { page } from '$app/stores';
	import miniaturesManifest from '$lib/data/miniatures.json';

	$: infos = $page.data.infos;
	$: showExplications = !!infos;

	$: enumeration = [
		'l’État',
		infos?.region?.titre,
		infos?.département?.titre,
		infos?.epci?.titre,
		infos?.ville?.titre
	]
		.filter(Boolean)
		.reduce((concatenation, item, index, list) => {
			const separator = index === 0 ? '' : index === list.length - 1 ? ' et ' : ', ';
			return concatenation + separator + item;
		}, '');
</script>

{#if showExplications}
	<div class="prose mt-12">
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
					Pour vous aider à y voir plus clair, nous proposons un calculateur d'aide simple et
					gratuit. Le tableau ci-dessus indique le montant maximum auquel vous pouvez prétendre pour
					l'achat de chaque type de vélo. Cliquez sur une catégorie pour accéder au calculateur
					détaillé et personnalisez le résultat en quelques clics.
				</p>

				{#each ['epci', 'ville', 'region', 'département'] as collectivite}
					{#if infos[collectivite]}
						<h2>
							Les aides {#if collectivite === 'département'}du{:else}de{/if}
							{infos[collectivite].titre.replace(/^le/, '')}
						</h2>
						{#if miniaturesManifest[infos[collectivite].ruleName]}
							<img
								src="/miniatures/{miniaturesManifest[infos[collectivite].ruleName]}"
								alt="Logo de {infos[collectivite].titre}"
								class="float-left pt-4 mr-6 !mb-6 max-h-[120px] w-[140px] object-contain"
							/>
						{/if}
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

			<p>
				Pour bénéficier du bonus écologique de l’État vous devez remplir les conditions suivantes :
			</p>
			<ul>
				<li>Être majeur et domicilié en France</li>
				<li>
					Avoir un revenu fiscal de référence par part de l'année précédant l'achat du vélo est
					inférieur ou égal à 13 489 €
				</li>
			</ul>
			<p>
				L’aide est de <strong>40% du prix du vélo</strong>, et elle est plafonnée en fonction du
				type de vélo. Par ailleurs du 15 août au 31 décembre 2022, les ménages les plus modestes
				bénéficient de plafonds plus élevés ainsi que d’une aide spécifique pour les vélos
				mécaniques non électriques.
			</p>

			<table>
				<thead>
					<tr>
						<th rowspan="2">Type de vélo</th>
						<th colspan="2" class="text-center">Plafond de l'aide</th>
					</tr>
					<tr>
						<th>Revenu : moins de 6&nbsp;300&nbsp;€/an</th>
						<th>Revenu : moins de 13&nbsp;489&nbsp;€/an</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Mécanique simple</td>
						<td>150 €</td>
						<td>0 €</td>
					</tr>
					<tr>
						<td>Vélo électrique</td>
						<td>400 €</td>
						<td>300 €</td>
					</tr>
					<tr>
						<td>Vélo cargo</td>
						<td>2 000 €</td>
						<td>1 000 €</td>
					</tr>
					<tr>
						<td>Vélo pliant</td>
						<td>2 000 €</td>
						<td>1 000 €</td>
					</tr>
				</tbody>
			</table>
			<p>
				La demande se fait en ligne au plus tard dans les <strong
					>6 mois suivant l’achat du vélo</strong
				>.
			</p>

			<p>
				En plus du bonus écologique, l’État propose aussi la <a href="/prime-a-la-conversion"
					>prime à la conversion</a
				> qui est une aide supplémentaire accordée en cas de remise à la case d’une vielle voiture essence
				ou diesel.
			</p>

			<h2>Quelles sont les pièces justificatives à fournir ?</h2>
			<p>
				Les documents demandés peuvent varier selon le type de vélo et l’organisme qui accorde
				l’aide. Dans la majorité des cas vous aurez besoin de
			</p>
			<ul>
				<li>
					copie de la facture d'achat acquittée avec le nom, le prénom et l'adresse du bénéficiaire
					et la mention du type de vélo acheté
				</li>
				<li>un justificatif de domicile récent</li>
				<li>
					un justificatif de revenu (dernier avis d’imposition) si l’aide est sous conditions de
					ressources
				</li>
				<li>un RIB pour reçevoir l’argent</li>
				<li>
					pour les vélos à assiance électrique : la copie du certificat d’homologation du vélo
				</li>
			</ul>
		{/if}
	</div>
{/if}
