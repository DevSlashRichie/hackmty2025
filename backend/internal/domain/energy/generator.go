package energy

type Generator interface {
	Generate(input, system string) (*string, error)
	GenerateWithFile(file []byte, fileName, prompt, system string) (*string, error)
}
