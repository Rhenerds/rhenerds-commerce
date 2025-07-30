<script lang="ts">
	import '../app.css'
	
	let { children } = $props()

	import {goto} from '$app/navigation'

	let searchTerm: string = ''

	function handleSearch() {
        if (searchTerm.trim()) {
            const encodedSearchTerm = encodeURIComponent(searchTerm.trim())
            goto(`/catalog/?q=${encodedSearchTerm}`)
        }
	}

	function handleKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }
</script>

<header>
	<a class="HeaderBox" href="/">
		<svg width="370" height="82" viewBox="0 0 370 82" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M106.957 80.8889V0H118.121L152.507 59.3333C153.102 60.4074 153.698 61.6296 154.293 63C154.889 64.3333 155.354 65.537 155.689 66.6111H156.024C155.912 65.463 155.838 64.1667 155.801 62.7222C155.763 61.2778 155.745 59.9815 155.745 58.8333V0H164.899V80.8889H154.07L119.461 21.4444C118.903 20.4444 118.307 19.2778 117.675 17.9444C117.042 16.6111 116.558 15.3889 116.223 14.2778H115.833C115.981 15.463 116.056 16.7778 116.056 18.2222C116.093 19.6296 116.112 20.9259 116.112 22.1111V80.8889H106.957Z" fill="white"/>
			<path d="M170.122 57.6667V53.1667C170.122 45.8333 172.653 39.963 177.714 35.5556C182.775 31.1111 189.492 28.8889 197.865 28.8889C206.276 28.8889 212.695 30.963 217.124 35.1111C221.589 39.2593 223.841 45.0926 223.878 52.6111V57.0556H174.923V50.5H213.942V49.9444C213.942 46.3519 212.769 43.2593 210.425 40.6667C208.08 38.0741 203.801 36.7778 197.586 36.7778C191.967 36.7778 187.65 38.2407 184.636 41.1667C181.621 44.0556 180.114 47.8148 180.114 52.4444V57.7222C180.114 62.7593 181.696 66.7593 184.859 69.7222C188.022 72.6482 192.655 74.1111 198.758 74.1111C202.74 74.1111 206.127 73.5 208.918 72.2778C211.709 71.0185 213.83 69.2222 215.281 66.8889L223.431 70.6111C221.719 73.8704 218.835 76.5926 214.779 78.7778C210.76 80.9259 205.457 82 198.87 82C189.715 82 182.626 79.8148 177.602 75.4445C172.615 71.0741 170.122 65.1481 170.122 57.6667Z" fill="white"/>
			<path d="M228.207 80.8889V30.1111H238.311L238.423 38.0556H238.311C240.246 35.5 242.702 33.3704 245.679 31.6667C248.694 29.963 252.285 29.1111 256.453 29.1111C257.383 29.1111 258.369 29.1667 259.411 29.2778C260.491 29.3889 261.254 29.5185 261.7 29.6667V38C260.919 37.8148 260.025 37.6667 259.021 37.5556C258.016 37.4444 256.899 37.3889 255.671 37.3889C252.099 37.3889 248.787 38.3148 245.735 40.1667C242.721 41.9815 240.339 44.3889 238.59 47.3889V80.8889H228.207Z" fill="white"/>
			<path d="M259.833 57.7222V53.1111C259.833 46.0741 262.048 40.3148 266.476 35.8333C270.942 31.3148 276.859 29.0556 284.227 29.0556C289.214 29.0556 293.401 29.7593 296.787 31.1667C300.174 32.537 302.834 34.3148 304.77 36.5V0H314.873V80.8889H304.993L304.881 73.1111H304.993C303.058 75.5185 300.322 77.5926 296.787 79.3333C293.289 81.0741 289.102 81.9445 284.227 81.9445C276.673 81.9445 270.719 79.6667 266.365 75.1111C262.01 70.5185 259.833 64.7222 259.833 57.7222ZM270.16 57.6667C270.16 62.5185 271.593 66.463 274.459 69.5C277.361 72.537 281.846 74.0556 287.912 74.0556C292.042 74.0556 295.54 73.1667 298.406 71.3889C301.309 69.6111 303.393 67.5556 304.658 65.2222V45.2778C303.43 42.9074 301.364 40.9444 298.462 39.3889C295.559 37.7963 292.042 37 287.912 37C281.808 37 277.324 38.5185 274.459 41.5556C271.593 44.5556 270.16 48.4815 270.16 53.3333V57.6667Z" fill="white"/>
			<path d="M320.933 64.8333L330.199 64.9445V66.5556C330.199 69.6667 331.558 71.8704 334.274 73.1667C336.991 74.4259 340.657 75.0556 345.271 75.0556C349.923 75.0556 353.496 74.4815 355.989 73.3333C358.482 72.1852 359.729 70.2778 359.729 67.6111C359.729 65.2037 358.501 63.4259 356.045 62.2778C353.589 61.1296 349.253 59.9074 343.038 58.6111C335.893 57.1296 330.758 55.2407 327.632 52.9444C324.543 50.6111 322.999 47.3148 322.999 43.0556C322.999 38.537 325.027 35.0556 329.083 32.6111C333.139 30.1296 338.721 28.8889 345.829 28.8889C352.9 28.8889 358.519 30.2037 362.687 32.8333C366.855 35.463 368.939 39.1296 368.939 43.8333V45.5H359.617V44.0556C359.617 41.0556 358.408 38.9815 355.989 37.8333C353.607 36.6482 350.165 36.0556 345.662 36.0556C341.308 36.0556 338.07 36.5556 335.949 37.5556C333.865 38.5556 332.823 40.2222 332.823 42.5556C332.823 44.5556 333.884 46.1296 336.005 47.2778C338.163 48.3889 342.313 49.5926 348.453 50.8889C355.635 52.3333 361.013 54.2037 364.585 56.5C368.195 58.7963 370 62.0556 370 66.2778C370 71.3519 367.935 75.2407 363.804 77.9445C359.71 80.6482 353.626 82 345.55 82C337.512 82 331.409 80.6667 327.241 78C323.073 75.3333 320.97 71.5185 320.933 66.5556V64.8333Z" fill="white"/>
			<path d="M25.9478 47.6373C25.9478 35.9084 35.5149 26.4003 47.3166 26.4003C59.1182 26.4003 68.6853 35.9084 68.6853 47.6373C68.6853 59.3662 59.1182 68.8744 47.3166 68.8744C35.5149 68.8744 25.9478 59.3662 25.9478 47.6373Z" fill="white"/>
			<path d="M60.8077 61.0453L47.3166 47.6373L33.8255 61.0452C30.9736 58.2108 29.0203 54.4833 28.427 50.321L47.3166 31.5478L66.2063 50.3211C65.6129 54.4834 63.6596 58.2109 60.8077 61.0453Z" fill="white"/>
			<path d="M66.2041 66.4084C68.9742 63.6554 71.1387 60.3005 72.482 56.5581L79.448 63.4812C80.8467 60.6796 81.8758 57.6923 82.4963 54.5919C83.8804 47.6769 83.17 40.5093 80.4552 33.9954C77.7403 27.4816 73.1429 21.9142 67.2443 17.9972C61.3457 14.0801 54.4108 11.9894 47.3166 11.9894C40.2223 11.9894 33.2874 14.0801 27.3888 17.9972C21.4902 21.9142 16.8928 27.4817 14.1779 33.9955C11.4631 40.5093 10.7528 47.6769 12.1368 54.5919C12.7573 57.6924 13.7864 60.6796 15.1851 63.4812L22.1513 56.558C23.4945 60.3005 25.659 63.6554 28.4291 66.4084L13.8587 80.889C11.1155 78.1627 8.73512 75.1267 6.75803 71.8564C3.96581 67.2378 1.97808 62.1519 0.909199 56.8114C-0.916525 47.6895 0.0204999 38.2344 3.60178 29.6417C7.18305 21.049 13.2477 13.7047 21.0289 8.53753C28.8101 3.37037 37.9582 0.612406 47.3166 0.612405C56.6749 0.612404 65.8231 3.37037 73.6042 8.53753C81.3854 13.7047 87.4501 21.049 91.0313 29.6417C94.6126 38.2343 95.5497 47.6895 93.7239 56.8114C92.6551 62.1519 90.6673 67.2378 87.8751 71.8564C85.8995 75.1243 83.5211 78.1582 80.7805 80.8829L80.7744 80.8889L66.2041 66.4084Z" fill="white"/>
		</svg>
		<p class="HeaderText">Katalog dan Preorder CF21</p>
	</a>
	<nav class="NavBox">
		<div class="NavBar">
			<a href="/" class="NavChoice">Home</a>
			<a href="/catalog" class="NavChoice">Catalog</a>
			<a href="/about" class="NavChoice">About Us</a>
			<a href="/cart" class="NavChoice">Cart</a>
		</div>
		<div class="SearchBar">
			<label for="SearchBar">Search</label>
  			<input type="text" id="SearchBar" placeholder="Search Here" bind:value={searchTerm} onkeyup={handleKeyPress}>
		</div>
	</nav>
</header>
<main class="MainBox">
	{@render children()}
</main>
<footer>
	<div class="FooterBar">
		<a class="FooterLink" href="https://github.com/Rhenerds/rhenerds-commerce">Source Code</a>
		<a class="FooterLink" href="/legal/privacy">Privacy Policy</a>
		<a class="FooterLink" href="/legal/tos">Terms of Service</a>
	</div>
	<div class="FooterBar">
		<p class="FooterText">©2025 Rhendra</p>
	</div>
</footer>


<style>
	@import url('/assets/roboto.css');

	.HeaderBox {
		display: flex;
		flex-direction:row;
		width: fit-content;
	}

	.HeaderText {
		color: #FFF;
		font-family: "Roboto Flex";
		font-size: 40px;
		font-style: normal;
		font-weight: 600;
		line-height: 90%; /* 36px */
		letter-spacing: -1.2px;
		width: auto;
		margin-top: auto;
		margin-left: 25px;
	}

	.NavBox {
		margin-top: 22px;
		margin-bottom: 22px;
		width: 100%;
		height: 70px;
		flex-shrink: 0;
		border-radius: 45px;
		background: #FFF;
		justify-content:flex-start;
		display: flex;
		flex-direction: row;
	}

	.NavBar {
		margin-top: auto;
		margin-bottom: auto;
		margin-left: 45px;
		margin-right: 45px;
		display: flex;
		flex-direction: row;
	}

	.NavChoice {
		color: #000;
		font-family: "Roboto Flex";
		font-size: 32px;
		font-style: normal;
		font-weight: 400;
		line-height: 90%; /* 28.8px */
		letter-spacing: -0.96px;
		padding-right: 40px;
	}

	.NavChoice:hover {
		text-decoration: underline 3px #000000;
	}

	.SearchBar {
		width: 292px;
		height: 58px;
		flex-shrink: 0;
		border-radius: 50px;
		background: #E4E4E4;
		margin-top: auto;
		margin-bottom: auto;
		margin-left: auto;
		margin-right: 45px;
	}

	.SearchBar label {
		display: none;
	}

	.SearchBar input[type="text"] {
	width: 100%;
	height: 100%;
	margin: 0;
	border: 0px;
	border-radius:50px;
	line-height: 1.5;
	color: #333;
	box-sizing: border-box;
	transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
	background: transparent;
	text-align: center;
	font-size: 20px;
	font-family: 'Roboto Flex';
	}

	.SearchBar input[type="text"]:focus {
	border-color: #000000;
	box-shadow: 0 0 0 3px rgba(59, 59, 59, 0.25);
	outline: none;
	}

	.MainBox {
		margin-top: 22px;
		margin-bottom: 22px;
		padding: 45px;
		width: 100%;
		height: fit-content;
		flex-shrink: 0;
		border-radius: 45px;
		background: #FFF;
		justify-content:flex-start;
		display: flex;
		flex-direction: column;
	}

	.FooterBar {
		justify-content: center;
		text-align: center;
		margin-top: 75px;
		margin-bottom: 75px;
		display: flex;
		flex-direction: row;
		width: 100%;
		height: fit-content;
	}

	.FooterLink {
		color: #FFF;
		text-align: center;
		font-family: "Roboto Flex";
		font-size: 24px;
		font-style: normal;
		font-weight: 600;
		line-height: 90%; /* 21.6px */
		letter-spacing: -0.72px;
		width: 300px;
		text-align: center;
	}

	.FooterLink:not(:last-child){
		margin-right: 80px;
	}

	.FooterLink:hover {
		text-decoration: underline 3px #FFF;
	}

	.FooterText {
		color: #FFF;
		text-align: center;
		font-family: "Roboto Flex";
		font-size: 24px;
		font-style: normal;
		font-weight: 600;
		line-height: 90%; /* 21.6px */
		letter-spacing: -0.72px;
		width: 300px;
		text-align: center;
	}
</style>