import handler from "@tanstack/react-start/server-entry";

export { DispatcherDO } from "@/lib/durable-objects/dispatcher";

export default {
	async fetch(request) {
		return handler.fetch(request);
	},
} satisfies ExportedHandler<Env>;
