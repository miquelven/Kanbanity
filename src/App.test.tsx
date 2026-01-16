import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import App from "./App";

describe("Board Integration Tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should create a new list", async () => {
    render(<App />);

    // Click on "Nova lista" button
    const newListButton = screen.getByText("Nova lista");
    fireEvent.click(newListButton);

    // Fill in the list title
    const titleInput = screen.getByPlaceholderText("Ex: A Fazer");
    fireEvent.change(titleInput, { target: { value: "Minha Nova Lista" } });

    // Click on "Salvar" button
    const saveButton = screen.getByText("Salvar");
    fireEvent.click(saveButton);

    // Verify if the list was created by looking for the heading specifically
    const headings = screen.getAllByRole("heading", { level: 3 });
    const newListHeading = headings.find(
      (h) => h.textContent === "Minha Nova Lista"
    );
    expect(newListHeading).toBeInTheDocument();
  });

  it("should create a new card in a list", async () => {
    render(<App />);

    // First, create a list
    const newListButton = screen.getByText("Nova lista");
    fireEvent.click(newListButton);
    const titleInput = screen.getByPlaceholderText("Ex: A Fazer");
    fireEvent.change(titleInput, { target: { value: "Lista de Tarefas" } });
    const saveButton = screen.getByText("Salvar");
    fireEvent.click(saveButton);

    // Wait for list modal to close (it might take time due to animation)
    // We check if "Nova Lista" title (from modal) is gone
    await waitForElementToBeRemoved(() => screen.queryByText("Nova Lista"));

    // Find the "Adicionar cartão" button
    // Note: The text is "Adicionar cartão", not "Adicionar card"
    const addCardButtons = screen.getAllByText("Adicionar cartão");
    const targetAddButton = addCardButtons[addCardButtons.length - 1];
    fireEvent.click(targetAddButton);

    // Verify modal opens
    expect(screen.getByText("Detalhes do cartão")).toBeInTheDocument();

    // Fill card details
    const cardTitleInput = screen.getByPlaceholderText("Ex: Comprar leite");
    fireEvent.change(cardTitleInput, {
      target: { value: "Novo Cartão Teste" },
    });

    const cardContentInput = screen.getByPlaceholderText(
      "Ex: Detalhes da tarefa..."
    );
    fireEvent.change(cardContentInput, {
      target: { value: "Descrição do teste" },
    });

    // Save card
    const saveCardButton = screen.getByText("Salvar");
    fireEvent.click(saveCardButton);

    // Verify card is in the document
    expect(screen.getByText("Novo Cartão Teste")).toBeInTheDocument();
  });

  it("should persist data in localStorage", async () => {
    // 1. Render App and create a list
    const { unmount } = render(<App />);

    const newListButton = screen.getByText("Nova lista");
    fireEvent.click(newListButton);
    const titleInput = screen.getByPlaceholderText("Ex: A Fazer");
    fireEvent.change(titleInput, { target: { value: "Lista Persistente" } });
    const saveButton = screen.getByText("Salvar");
    fireEvent.click(saveButton);

    // Check if it exists
    const headings = screen.getAllByRole("heading", { level: 3 });
    const listHeading = headings.find(
      (h) => h.textContent === "Lista Persistente"
    );
    expect(listHeading).toBeInTheDocument();

    // 2. Unmount component to simulate page reload/close
    unmount();

    // 3. Render App again
    render(<App />);

    // 4. Verify if the list is still there
    const headingsAfterReload = screen.getAllByRole("heading", { level: 3 });
    const listHeadingAfterReload = headingsAfterReload.find(
      (h) => h.textContent === "Lista Persistente"
    );
    expect(listHeadingAfterReload).toBeInTheDocument();
  });
});
