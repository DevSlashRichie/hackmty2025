package gemini

import (
	"context"
	"google.golang.org/genai"
)

type Client struct {
	client *genai.Client
}

func NewClient(apiKey string) (*Client, error) {
	c := &genai.ClientConfig{
		APIKey:  apiKey,
		Backend: genai.BackendGeminiAPI,
	}

	client, err := genai.NewClient(context.Background(), c)

	if err != nil {
		return nil, err
	}

	return &Client{
		client: client,
	}, nil
}

func (c *Client) Generate(input, system string) (*string, error) {
	temp := float32(0.3)

	config := &genai.GenerateContentConfig{
		SystemInstruction: genai.NewContentFromText(system, genai.RoleUser),
		Temperature:       &temp,
	}

	// expanded on how to include several messages.
	cont := []*genai.Content{
		{
			Role:  genai.RoleUser,
			Parts: []*genai.Part{{Text: input}},
		},
	}

	genai.Text(input)

	r, err := c.client.Models.GenerateContent(context.Background(), "gemini-2.5-flash", cont, config)

	if err != nil {
		return nil, err
	}

	text := r.Text()

	return &text, nil
}

func (c *Client) GenerateWithFile(file []byte, fileName, prompt, system string) (*string, error) {
	temp := float32(0.3)

	config := &genai.GenerateContentConfig{
		SystemInstruction: genai.NewContentFromText(system, genai.RoleUser),
		Temperature:       &temp,
	}

	cont := []*genai.Content{
		{
			Role: genai.RoleUser,
			Parts: []*genai.Part{
				{
					InlineData: &genai.Blob{
						Data: file,
						MIMEType: "application/pdf",
					},
				},
				genai.NewPartFromText(prompt),
			},
		},
	}

	r, err := c.client.Models.GenerateContent(context.Background(), "gemini-2.5-flash", cont, config)
	if err != nil {
		return nil, err
	}

	text := r.Text()

	return &text, nil
}
