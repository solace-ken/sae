// ---------------------------------------------------------------------
// Internal Templates
// ---------------------------------------------------------------------

// SOLACE LOGO
export const logotpl = `
<div id="logo" class="logo">
	<a href="/sae/"><img src="/sae/lib/img/solace-logo.svg" id="logoimage" height="250" title="SOLACE"></a>
</div>	
`;

// SPINNER TEMPLATE
export const spintpl = `
<div id="spinner" class="spinner">
	<h3 id="head" class="spinhead"></h3>
	<div id="gears" class="gears"><img src="/sae/lib/img/gears.gif" height="90" width="110" title="Loading..."></div>
	<div id="blocks" class="blocks"><img src="/sae/lib/img/square-loader.gif" width="160" height="24" title="Loading..."></div>
	<p id="msg" class="spinmsg"></p>
</div>
`;

// ERROR TEMPLATE
export const errtpl = `
<div id="errmsg" class="errmsg">
	<h3 id="title" class="title">Error!</h3>
	<p id="errimg"><img src="/sae/lib/img/error.svg" width="100" title="Error!"></p>
	<p id="cause" class="cause"></p>
	<p id="solution" class="solution"></p>
</div>
`;

// IFRAME TEMPLATE
export const iframetpl = `
<iframe id="appviewer" name="appviewer" title="Current Application" src="/sae/lib/blank.html"></iframe>
`;