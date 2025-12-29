import salesAgent from "@playground/salesAgent";

salesAgent.run({ user: { request: "inter.pdf" } });

console.log(salesAgent.context);
