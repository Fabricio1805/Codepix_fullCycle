package cmd

import (
	"os"

	"github.com/Fabricio1805/imersaoFullCycle/codePix-go/domain/model"
	"github.com/Fabricio1805/imersaoFullCycle/codePix-go/infrastructure/db"
	"github.com/Fabricio1805/imersaoFullCycle/codePix-go/infrastructure/repository"
	"github.com/spf13/cobra"
)

var fixturesCmd = &cobra.Command{
	Use:   "fixtures",
	Short: "Run fixtures for fake data generation",
	Run: func(cmd *cobra.Command, args []string) {
		database := db.ConnectDB(os.Getenv("env"))
		defer database.Close()
		pixRepository := repository.PixKeyRepositoryDb{Db: database}

		bankBBX, _ := model.NewBank("001", "BBX")
		bankCTER, _ := model.NewBank("002", "CTER")
		pixRepository.AddBank(bankBBX)
		pixRepository.AddBank(bankCTER)

		account1, _ := model.NewAccount(bankBBX, "1111", "User BBX 1")
		account1.ID = "8254b794-3793-429e-bf74-35af166b9454"
		pixRepository.AddAccount(account1)

		account2, _ := model.NewAccount(bankBBX, "2222", "User BBX 2")
		account2.ID = "51a720b2-5144-4d7f-921d-57023b1e24c1"
		pixRepository.AddAccount(account2)

		account3, _ := model.NewAccount(bankCTER, "3333", "User CTER 1")
		account3.ID = "62782236-bb2e-4a8a-ba94-d1aaad621d9f"
		pixRepository.AddAccount(account3)

		account4, _ := model.NewAccount(bankCTER, "4444", "User CTER 2")
		account4.ID = "463b1b2a-b5fa-4b88-9c31-e5c894a20ae3"
		pixRepository.AddAccount(account4)
	},
}

func init() {
	rootCmd.AddCommand(fixturesCmd)
}