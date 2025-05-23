import { fireEvent, screen, within } from "@testing-library/react";
import { API } from "api/api";
import { MockGitSSHKey, mockApiError } from "testHelpers/entities";
import { renderWithAuth } from "testHelpers/renderHelpers";
import SSHKeysPage, { Language as SSHKeysPageLanguage } from "./SSHKeysPage";

describe("SSH keys Page", () => {
	it("shows the SSH key", async () => {
		renderWithAuth(<SSHKeysPage />);
		await screen.findByText(MockGitSSHKey.public_key);
	});

	describe("regenerate SSH key", () => {
		describe("when it is success", () => {
			it("shows a success message and updates the ssh key on the page", async () => {
				renderWithAuth(<SSHKeysPage />);

				// Wait to the ssh be rendered on the screen
				await screen.findByText(MockGitSSHKey.public_key);

				// Click on the "Regenerate" button to display the confirm dialog
				const regenerateButton = screen.getByTestId("regenerate");
				fireEvent.click(regenerateButton);
				const confirmDialog = screen.getByRole("dialog");
				expect(confirmDialog).toHaveTextContent(
					SSHKeysPageLanguage.regenerateDialogMessage,
				);

				const newUserSSHKey =
					"ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDSC/ouD/LqiT1Rd99vDv/MwUmqzJuinLTMTpk5kVy66";
				jest.spyOn(API, "regenerateUserSSHKey").mockResolvedValueOnce({
					...MockGitSSHKey,
					public_key: newUserSSHKey,
				});

				// Click on the "Confirm" button
				const confirmButton = within(confirmDialog).getByRole("button", {
					name: SSHKeysPageLanguage.confirmLabel,
				});
				fireEvent.click(confirmButton);

				// Check if the success message is displayed
				await screen.findByText("SSH Key regenerated successfully.");

				// Check if the API was called correctly
				expect(API.regenerateUserSSHKey).toBeCalledTimes(1);

				// Check if the SSH key is updated
				await screen.findByText(newUserSSHKey);
			});
		});

		describe("when it fails", () => {
			it("shows an error message", async () => {
				renderWithAuth(<SSHKeysPage />);

				// Wait to the ssh be rendered on the screen
				await screen.findByText(MockGitSSHKey.public_key);

				jest.spyOn(API, "regenerateUserSSHKey").mockRejectedValueOnce(
					mockApiError({
						message: SSHKeysPageLanguage.regenerationError,
					}),
				);

				// Click on the "Regenerate" button to display the confirm dialog
				const regenerateButton = screen.getByTestId("regenerate");
				fireEvent.click(regenerateButton);
				const confirmDialog = screen.getByRole("dialog");
				expect(confirmDialog).toHaveTextContent(
					SSHKeysPageLanguage.regenerateDialogMessage,
				);

				// Click on the "Confirm" button
				const confirmButton = within(confirmDialog).getByRole("button", {
					name: SSHKeysPageLanguage.confirmLabel,
				});
				fireEvent.click(confirmButton);

				// Check if the error message is displayed
				const alert = await screen.findByRole("alert");
				expect(alert).toHaveTextContent(SSHKeysPageLanguage.regenerationError);

				// Check if the API was called correctly
				expect(API.regenerateUserSSHKey).toBeCalledTimes(1);
			});
		});
	});
});
